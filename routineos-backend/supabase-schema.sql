-- RoutineOS — Complete Supabase SQL Schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New Query)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email            TEXT UNIQUE NOT NULL,
  name             TEXT,
  avatar_url       TEXT,
  wake_time        TIME NOT NULL DEFAULT '06:00',
  sleep_time       TIME NOT NULL DEFAULT '23:00',
  current_mode     TEXT DEFAULT 'normal'
                   CHECK (current_mode IN ('normal','exam','travel','sick','grind')),
  mode_until       DATE,
  consistency_score FLOAT DEFAULT 0 CHECK (consistency_score >= 0 AND consistency_score <= 100),
  buddy_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  timezone         TEXT DEFAULT 'Asia/Kolkata',
  fcm_token        TEXT,
  onboarding_done  BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── HABITS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habits (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 100),
  category         TEXT NOT NULL
                   CHECK (category IN ('health','study','skill','mindfulness','personal')),
  icon             TEXT DEFAULT '✅',
  scheduled_time   TIME,
  duration_mins    INT DEFAULT 30 CHECK (duration_mins > 0 AND duration_mins <= 480),
  active_modes     TEXT[] DEFAULT ARRAY['normal','grind'],
  micro_version    TEXT,
  is_active        BOOLEAN DEFAULT TRUE,
  sort_order       INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── HABIT LOGS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habit_logs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id         UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date             DATE NOT NULL,
  status           TEXT NOT NULL
                   CHECK (status IN ('completed','skipped','micro','missed')),
  completed_at     TIMESTAMPTZ,
  mood_before      INT CHECK (mood_before BETWEEN 1 AND 5),
  note             TEXT CHECK (length(note) <= 500),
  active_mode      TEXT DEFAULT 'normal',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (habit_id, date)
);

-- ─── RECOVERY SESSIONS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS recovery_sessions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  triggered_at     TIMESTAMPTZ DEFAULT NOW(),
  missed_days      INT NOT NULL DEFAULT 2,
  reason           TEXT CHECK (reason IN ('exam','travel','sick','other')),
  recovery_plan    JSONB NOT NULL DEFAULT '{}',
  status           TEXT DEFAULT 'active' CHECK (status IN ('active','completed')),
  ends_at          DATE
);

-- ─── WEEKLY INSIGHTS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_insights (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start       DATE NOT NULL,
  insight_text     TEXT,
  best_day         TEXT,
  worst_day        TEXT,
  top_habit        TEXT,
  consistency_pct  FLOAT CHECK (consistency_pct >= 0 AND consistency_pct <= 100),
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, week_start)
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_buddy_id ON users(buddy_id);
CREATE INDEX IF NOT EXISTS idx_users_onboarding ON users(onboarding_done);

-- Habits
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_active ON habits(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_habits_sort ON habits(user_id, sort_order);

-- Habit logs
CREATE INDEX IF NOT EXISTS idx_logs_user_date ON habit_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_logs_habit_date ON habit_logs(habit_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_logs_user_status ON habit_logs(user_id, status);

-- Recovery
CREATE INDEX IF NOT EXISTS idx_recovery_user ON recovery_sessions(user_id, status);

-- Insights
CREATE INDEX IF NOT EXISTS idx_insights_user ON weekly_insights(user_id, week_start DESC);

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_insights ENABLE ROW LEVEL SECURITY;

-- Users: can read/write own row; can read buddy's row (score only — enforced in app)
CREATE POLICY "users_own_row" ON users
  FOR ALL USING (auth.uid() = id);

-- Habits: users own their habits
CREATE POLICY "habits_own" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- Habit logs: users own their logs
CREATE POLICY "logs_own" ON habit_logs
  FOR ALL USING (auth.uid() = user_id);

-- Recovery: users own their sessions
CREATE POLICY "recovery_own" ON recovery_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Insights: users own their insights
CREATE POLICY "insights_own" ON weekly_insights
  FOR ALL USING (auth.uid() = user_id);

-- Service role bypass (backend uses service key, bypasses RLS automatically)

-- ─── STORAGE BUCKET (for avatars, optional) ───────────────────────────────────
-- Run in Supabase dashboard Storage tab, or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- ─── SEED: default user profile on signup ─────────────────────────────────────
-- This function auto-creates a users row when someone signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
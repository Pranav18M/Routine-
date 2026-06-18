'use client';
import { useState, useEffect, useCallback } from 'react';
import Header from '../../../components/layout/Header';
import PageWrapper from '../../../components/layout/PageWrapper';
import MorningBriefing from '../../../components/dashboard/MorningBriefing';
import ConsistencyRing from '../../../components/dashboard/ConsistencyRing';
import ModeIndicator from '../../../components/dashboard/ModeIndicator';
import TodaySummary from '../../../components/dashboard/TodaySummary';
import HabitTimeline from '../../../components/habits/HabitTimeline';
import HabitCheckoff from '../../../components/habits/HabitCheckoff';
import RecoveryScreen from '../../../components/recovery/RecoveryScreen';
import RecoveryPlanCard from '../../../components/recovery/RecoveryPlanCard';
import ModeSwitcher from '../../../components/mode/ModeSwitcher';
import { DashboardSkeleton } from '../../../components/ui/LoadingSkeleton';
import { useAuth } from '../../../hooks/useAuth';
import { useHabits } from '../../../hooks/useHabits';
import { useLogs } from '../../../hooks/useLogs';
import { useRecovery } from '../../../hooks/useRecovery';
import useStore from '../../../store/useStore';
import { userApi } from '../../../lib/api';
import { getGreeting } from '../../../lib/utils';

export default function TodayPage() {
  const { user, refreshProfile } = useAuth();
  const { habits, fetchHabits, loading: habitsLoading } = useHabits();
  const { fetchTodayLogs, logHabit, completionSummary } = useLogs();
  const { checkRecoveryStatus, generateRecoveryPlan, completeRecovery } = useRecovery();
  const {
    todayLogs, recoverySession, needsRecovery, currentMode, setCurrentMode, briefingText
  } = useStore();

  const [pageLoading, setPageLoading] = useState(true);
  const [checkoffHabit, setCheckoffHabit] = useState(null);
  const [modeSwitcherOpen, setModeSwitcherOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const load = useCallback(async () => {
    await Promise.all([
      fetchHabits(),
      fetchTodayLogs(),
      checkRecoveryStatus(),
    ]);
    setPageLoading(false);
  }, [fetchHabits, fetchTodayLogs, checkRecoveryStatus]);

  useEffect(() => {
    load();
    if (user?.current_mode) setCurrentMode(user.current_mode);
  }, [load, user, setCurrentMode]);

  const handleComplete = async (habitId) => {
    await logHabit(habitId, 'completed');
  };

  const handleMicroLog = async (habit) => {
    await logHabit(habit.id, 'micro');
  };

  const handleSwitchMode = async (mode, duration) => {
    setSwitching(true);
    try {
      await userApi.switchMode({ mode, durationDays: duration });
      setCurrentMode(mode);
      await refreshProfile();
      await fetchHabits(mode);
    } finally {
      setSwitching(false);
      setModeSwitcherOpen(false);
    }
  };

  const summary = completionSummary(todayLogs, habits);

  if (pageLoading) {
    return (
      <>
        <Header title="Today" />
        <PageWrapper><DashboardSkeleton /></PageWrapper>
      </>
    );
  }

  // Recovery gate
  if (needsRecovery && !recoverySession) {
    return (
      <RecoveryScreen
        missedDays={2}
        onGenerate={generateRecoveryPlan}
        generating={false}
      />
    );
  }

  return (
    <>
      <Header
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        showMode
        rightAction={
          <button
            onClick={() => setModeSwitcherOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-[10px]
              bg-[var(--color-elevated)] text-secondary hover:text-primary transition-colors"
          >
            ⚡
          </button>
        }
      />

      <PageWrapper>
        <div className="space-y-4 stagger-children">
          {/* Morning briefing */}
          {briefingText && <MorningBriefing text={briefingText} />}

          {/* Recovery plan if active */}
          {recoverySession && (
            <RecoveryPlanCard
              session={recoverySession}
              onComplete={completeRecovery}
            />
          )}

          {/* Consistency ring */}
          <ConsistencyRing
            score={user?.consistency_score || 0}
            todayCompleted={summary.completed}
            todayTotal={summary.total}
          />

          {/* Mode indicator */}
          <ModeIndicator
            mode={currentMode || 'normal'}
            modeUntil={user?.mode_until}
            onSwitch={() => setModeSwitcherOpen(true)}
          />

          {/* Today summary bar */}
          {habits.length > 0 && (
            <TodaySummary
              completed={summary.completed}
              total={summary.total}
            />
          )}

          {/* Habit timeline */}
          <HabitTimeline
            habits={habits}
            logs={todayLogs}
            onComplete={handleComplete}
            onMicro={handleMicroLog}
            onPress={setCheckoffHabit}
          />
        </div>
      </PageWrapper>

      {/* Habit checkoff sheet */}
      <HabitCheckoff
        habit={checkoffHabit}
        isOpen={!!checkoffHabit}
        onClose={() => setCheckoffHabit(null)}
        onLog={logHabit}
      />

      {/* Mode switcher */}
      <ModeSwitcher
        currentMode={currentMode}
        isOpen={modeSwitcherOpen}
        onClose={() => setModeSwitcherOpen(false)}
        onSwitch={handleSwitchMode}
        switching={switching}
      />
    </>
  );
}
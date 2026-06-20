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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

export default function TodayPage() {
  const { user, refreshProfile } = useAuth();
  const { habits, fetchHabits } = useHabits();
  const { fetchTodayLogs, logHabit, completionSummary } = useLogs();
  const { checkRecoveryStatus, generateRecoveryPlan, completeRecovery, generating } = useRecovery();
  const { todayLogs, recoverySession, needsRecovery, currentMode, setCurrentMode, briefingText } = useStore();

  const [pageLoading, setPageLoading] = useState(true);
  const [checkoffHabit, setCheckoffHabit] = useState(null);
  const [modeSwitcherOpen, setModeSwitcherOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const load = useCallback(async () => {
    await Promise.all([fetchHabits(), fetchTodayLogs(), checkRecoveryStatus()]);
    setPageLoading(false);
  }, [fetchHabits, fetchTodayLogs, checkRecoveryStatus]);

  useEffect(() => {
    load();
    if (user?.current_mode) setCurrentMode(user.current_mode);
  }, [load, user, setCurrentMode]);

  const handleComplete = async (habitId) => { await logHabit(habitId, 'completed'); };
  const handleMicroLog = async (habit) => { await logHabit(habit.id, 'micro'); };

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

  if (needsRecovery && !recoverySession) {
    return <RecoveryScreen missedDays={2} onGenerate={generateRecoveryPlan} generating={generating} />;
  }

  return (
    <>
      <Header
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        subtitle={new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
        showMode
        rightAction={
          <button onClick={() => setModeSwitcherOpen(true)} className="pg-icon-btn">⚡</button>
        }
      />

      <PageWrapper>
        <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {briefingText && <MorningBriefing text={briefingText} />}

          {recoverySession && <RecoveryPlanCard session={recoverySession} onComplete={completeRecovery} />}

          <ConsistencyRing score={user?.consistency_score || 0} todayCompleted={summary.completed} todayTotal={summary.total} />

          <ModeIndicator mode={currentMode || 'normal'} modeUntil={user?.mode_until} onSwitch={() => setModeSwitcherOpen(true)} />

          {habits.length > 0 && <TodaySummary completed={summary.completed} total={summary.total} />}

          <HabitTimeline habits={habits} logs={todayLogs} onComplete={handleComplete} onMicro={handleMicroLog} onPress={setCheckoffHabit} />
        </div>
      </PageWrapper>

      <HabitCheckoff habit={checkoffHabit} isOpen={!!checkoffHabit} onClose={() => setCheckoffHabit(null)} onLog={logHabit} />

      <ModeSwitcher currentMode={currentMode} isOpen={modeSwitcherOpen} onClose={() => setModeSwitcherOpen(false)} onSwitch={handleSwitchMode} switching={switching} />
    </>
  );
}

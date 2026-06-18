'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/layout/Header';
import PageWrapper from '../../../components/layout/PageWrapper';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { userApi } from '../../../lib/api';
import useStore from '../../../store/useStore';
import { cn } from '../../../lib/utils';

function SettingRow({ label, sublabel, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 border-b border-[var(--color-border)] last:border-0">
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-primary">{label}</p>
        {sublabel && <p className="text-[12px] text-secondary mt-0.5">{sublabel}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        'w-12 h-6 rounded-full transition-all duration-300 relative',
        value ? 'bg-[#6C47FF]' : 'bg-[var(--color-elevated)]',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300',
          value ? 'left-[26px]' : 'left-0.5',
        )}
      />
    </button>
  );
}

const TIMEZONES = [
  'Asia/Kolkata', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Singapore', 'Australia/Sydney',
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, refreshProfile } = useAuth();
  const { isDarkMode, toggleDarkMode, addToast } = useStore();

  const [form, setForm] = useState({
    name: '',
    wake_time: '06:00',
    sleep_time: '23:00',
    timezone: 'Asia/Kolkata',
  });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        wake_time: user.wake_time || '06:00',
        sleep_time: user.sleep_time || '23:00',
        timezone: user.timezone || 'Asia/Kolkata',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userApi.updateProfile(form);
      await refreshProfile();
      addToast({ type: 'success', message: 'Settings saved' });
    } catch {
      addToast({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      await userApi.deleteAccount();
      router.replace('/login');
    } catch {
      addToast({ type: 'error', message: 'Failed to delete account' });
    }
  };

  const inputClass = `w-full bg-[var(--color-elevated)] border border-[var(--color-border)]
    rounded-[10px] px-3 py-2.5 text-[14px] text-primary focus:outline-none
    focus:border-[#6C47FF] transition-colors`;

  return (
    <>
      <Header title="Settings" />

      <PageWrapper>
        <div className="space-y-5 stagger-children">

          {/* Profile */}
          <div className="solid-card p-4">
            <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-3">Profile</p>
            <div className="space-y-3">
              <div>
                <p className="text-[12px] text-secondary mb-1.5">Display name</p>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <SettingRow label="Email" sublabel={user?.email}>
                <span className="text-[11px] px-2 py-1 rounded-pill bg-[var(--color-elevated)] text-muted">
                  Cannot change
                </span>
              </SettingRow>
            </div>
          </div>

          {/* Schedule */}
          <div className="solid-card p-4">
            <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-3">Daily Schedule</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-primary">Wake time</p>
                  <p className="text-[12px] text-secondary">Used for morning habit scheduling</p>
                </div>
                <input
                  type="time"
                  value={form.wake_time}
                  onChange={e => setForm(f => ({ ...f, wake_time: e.target.value }))}
                  className="bg-[var(--color-elevated)] border border-[var(--color-border)] rounded-[10px]
                    px-3 py-2 text-[14px] font-semibold text-primary focus:outline-none focus:border-[#6C47FF]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-primary">Sleep time</p>
                  <p className="text-[12px] text-secondary">Evening habit cutoff</p>
                </div>
                <input
                  type="time"
                  value={form.sleep_time}
                  onChange={e => setForm(f => ({ ...f, sleep_time: e.target.value }))}
                  className="bg-[var(--color-elevated)] border border-[var(--color-border)] rounded-[10px]
                    px-3 py-2 text-[14px] font-semibold text-primary focus:outline-none focus:border-[#6C47FF]"
                />
              </div>
              <div>
                <p className="text-[12px] text-secondary mb-1.5">Timezone</p>
                <select
                  value={form.timezone}
                  onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
                  className={inputClass}
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="solid-card p-4">
            <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Appearance</p>
            <SettingRow label="Dark mode" sublabel="Easier on the eyes at night">
              <Toggle value={isDarkMode} onChange={toggleDarkMode} />
            </SettingRow>
          </div>

          {/* Save */}
          <Button fullWidth size="lg" onClick={handleSave} loading={saving}>
            Save changes
          </Button>

          {/* App info */}
          <div className="solid-card p-4 space-y-0">
            <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">App</p>
            <SettingRow label="Version" sublabel="RoutineOS">
              <span className="text-[13px] text-muted">1.0.0</span>
            </SettingRow>
            <SettingRow label="Consistency score" sublabel="Updates nightly">
              <span className="text-[15px] font-bold text-[#6C47FF]">
                {Math.round(user?.consistency_score || 0)}
              </span>
            </SettingRow>
          </div>

          {/* Account actions */}
          <div className="solid-card p-4 space-y-0">
            <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-1">Account</p>
            <SettingRow label="Sign out" sublabel="You can sign back in anytime">
              <Button size="sm" variant="secondary" onClick={handleSignOut}>
                Sign out
              </Button>
            </SettingRow>
            <SettingRow label="Delete account" sublabel="This is permanent and cannot be undone">
              {confirmDelete ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="danger" onClick={handleDeleteAccount}>
                    Confirm delete
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>
                  Delete
                </Button>
              )}
            </SettingRow>
          </div>

          {/* Footer */}
          <p className="text-center text-[11px] text-muted pb-4 leading-relaxed">
            RoutineOS · Built for humans, not streaks
          </p>
        </div>
      </PageWrapper>
    </>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/layout/Header';
import PageWrapper from '../../../components/layout/PageWrapper';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { userApi } from '../../../lib/api';
import useStore from '../../../store/useStore';

function SettingRow({ label, sublabel, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ minWidth:0 }}>
        <p style={{ fontSize:14, fontWeight:600, color:'#F4F4F8', margin:0 }}>{label}</p>
        {sublabel && <p style={{ fontSize:12, color:'#9B9BB4', margin:'2px 0 0' }}>{sublabel}</p>}
      </div>
      <div style={{ flexShrink:0 }}>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className={'toggle ' + (value ? 'on' : 'off')}>
      <span className="toggle-knob" />
    </button>
  );
}

const TIMEZONES = ['Asia/Kolkata','America/New_York','America/Los_Angeles','America/Chicago','Europe/London','Europe/Paris','Asia/Tokyo','Asia/Singapore','Australia/Sydney'];

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, refreshProfile } = useAuth();
  const { addToast } = useStore();
  const [form, setForm] = useState({ name:'', wake_time:'06:00', sleep_time:'23:00', timezone:'Asia/Kolkata' });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (user) setForm({ name: user.name||'', wake_time: user.wake_time||'06:00', sleep_time: user.sleep_time||'23:00', timezone: user.timezone||'Asia/Kolkata' });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userApi.updateProfile(form);
      await refreshProfile();
      addToast({ type:'success', message:'Settings saved' });
    } catch {
      addToast({ type:'error', message:'Failed to save settings' });
    } finally { setSaving(false); }
  };

  const handleSignOut = async () => { await signOut(); router.replace('/login'); };

  const handleDeleteAccount = async () => {
    try { await userApi.deleteAccount(); router.replace('/login'); }
    catch { addToast({ type:'error', message:'Failed to delete account' }); }
  };

  return (
    <>
      <Header title="Settings" />
      <PageWrapper>
        <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:20 }}>

          <div className="card card-pad">
            <p style={{ fontSize:12, fontWeight:600, color:'#9B9BB4', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Profile</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div>
                <label className="field-label">Display name</label>
                <input value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))} placeholder="Your name" className="field-input" />
              </div>
              <SettingRow label="Email" sublabel={user?.email}>
                <span className="pill" style={{ background:'#252540', color:'#5C5C78' }}>Cannot change</span>
              </SettingRow>
            </div>
          </div>

          <div className="card card-pad">
            <p style={{ fontSize:12, fontWeight:600, color:'#9B9BB4', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>Daily Schedule</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:600, color:'#F4F4F8', margin:0 }}>Wake time</p>
                  <p style={{ fontSize:12, color:'#9B9BB4', margin:0 }}>Used for morning habit scheduling</p>
                </div>
                <input type="time" value={form.wake_time} onChange={e => setForm(f=>({...f, wake_time:e.target.value}))}
                  style={{ background:'#252540', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 12px', fontSize:14, fontWeight:600, color:'#F4F4F8' }} />
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:600, color:'#F4F4F8', margin:0 }}>Sleep time</p>
                  <p style={{ fontSize:12, color:'#9B9BB4', margin:0 }}>Evening habit cutoff</p>
                </div>
                <input type="time" value={form.sleep_time} onChange={e => setForm(f=>({...f, sleep_time:e.target.value}))}
                  style={{ background:'#252540', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 12px', fontSize:14, fontWeight:600, color:'#F4F4F8' }} />
              </div>
              <div>
                <label className="field-label">Timezone</label>
                <select value={form.timezone} onChange={e => setForm(f=>({...f, timezone:e.target.value}))} className="field-input">
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace('_',' ')}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <p style={{ fontSize:12, fontWeight:600, color:'#9B9BB4', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Appearance</p>
            <SettingRow label="Dark mode" sublabel="Easier on the eyes at night">
              <Toggle value={darkMode} onChange={setDarkMode} />
            </SettingRow>
          </div>

          <Button fullWidth size="lg" onClick={handleSave} loading={saving}>Save changes</Button>

          <div className="card card-pad">
            <p style={{ fontSize:12, fontWeight:600, color:'#9B9BB4', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>App</p>
            <SettingRow label="Version" sublabel="RoutineOS"><span style={{ fontSize:13, color:'#5C5C78' }}>1.0.0</span></SettingRow>
            <SettingRow label="Consistency score" sublabel="Updates nightly"><span style={{ fontSize:15, fontWeight:700, color:'#6C47FF' }}>{Math.round(user?.consistency_score||0)}</span></SettingRow>
          </div>

          <div className="card card-pad">
            <p style={{ fontSize:12, fontWeight:600, color:'#9B9BB4', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Account</p>
            <SettingRow label="Sign out" sublabel="You can sign back in anytime">
              <Button size="sm" variant="secondary" onClick={handleSignOut}>Sign out</Button>
            </SettingRow>
            <SettingRow label="Delete account" sublabel="This is permanent and cannot be undone">
              {confirmDelete ? (
                <div style={{ display:'flex', gap:8 }}>
                  <Button size="sm" variant="danger" onClick={handleDeleteAccount}>Confirm delete</Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                </div>
              ) : (
                <Button size="sm" variant="danger" onClick={() => setConfirmDelete(true)}>Delete</Button>
              )}
            </SettingRow>
          </div>

          <p style={{ textAlign:'center', fontSize:11, color:'#5C5C78', paddingBottom:16, lineHeight:1.6 }}>RoutineOS · Built for humans, not streaks</p>
        </div>
      </PageWrapper>
    </>
  );
}

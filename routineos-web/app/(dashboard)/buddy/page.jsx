'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/layout/Header';
import PageWrapper from '../../../components/layout/PageWrapper';
import BuddyCard from '../../../components/buddy/BuddyCard';
import InviteModal from '../../../components/buddy/InviteModal';
import Button from '../../../components/ui/Button';
import { HabitCardSkeleton } from '../../../components/ui/LoadingSkeleton';
import { useBuddy } from '../../../hooks/useBuddy';

export default function BuddyPage() {
  const { buddy, inviteCode, loading, nudging, fetchBuddy, fetchInviteCode, connectBuddy, removeBuddy, nudgeBuddy } = useBuddy();
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => { fetchBuddy(); fetchInviteCode(); }, []);

  return (
    <>
      <Header title="Accountability Buddy" subtitle="Stay on track together" />

      <PageWrapper>
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <HabitCardSkeleton /><HabitCardSkeleton />
          </div>
        ) : buddy ? (
          <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <BuddyCard buddy={buddy} onNudge={nudgeBuddy} nudging={nudging} onRemove={removeBuddy} />

            <div className="glass-card card-pad">
              <p style={{ fontSize:13, color:'#9B9BB4', lineHeight:1.6, margin:0 }}>
                🔒 <strong style={{ color:'#F4F4F8' }}>Privacy:</strong> You can only see each other's
                consistency score — not individual habits or notes. Your routine stays private.
              </p>
            </div>

            <div className="card card-pad">
              <p style={{ fontSize:13, fontWeight:600, color:'#9B9BB4', marginBottom:8 }}>Your invite code</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <p style={{ fontSize:22, fontWeight:700, color:'#F4F4F8', letterSpacing:6, flex:1, margin:0 }}>{inviteCode || '------'}</p>
                <button onClick={() => navigator.clipboard.writeText(inviteCode)} style={{ fontSize:12, fontWeight:600, color:'#6C47FF', background:'none', border:'none', cursor:'pointer' }}>Copy</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <p style={{ fontSize:48, marginBottom:16 }}>🤝</p>
              <h2 style={{ fontSize:20, fontWeight:700, color:'#F4F4F8', margin:0 }}>No buddy yet</h2>
              <p style={{ fontSize:14, color:'#9B9BB4', marginTop:8, lineHeight:1.6, maxWidth:260, marginLeft:'auto', marginRight:'auto' }}>
                Connect with a friend to keep each other accountable. You'll only see their consistency score.
              </p>
            </div>

            <Button fullWidth size="lg" onClick={() => setInviteOpen(true)}>Connect with a buddy</Button>

            <div className="card card-pad" style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <p style={{ fontSize:14, fontWeight:600, color:'#F4F4F8', margin:0 }}>How it works</p>
              {[
                ['1️⃣','Share your 6-digit invite code with a friend'],
                ['2️⃣','They enter your code (or you enter theirs)'],
                ['3️⃣',"See each other's score and send nudges"],
              ].map(([emoji, text], i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{emoji}</span>
                  <p style={{ fontSize:13, color:'#9B9BB4', lineHeight:1.5, margin:0 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageWrapper>

      <InviteModal isOpen={inviteOpen} onClose={() => setInviteOpen(false)} inviteCode={inviteCode} onConnect={connectBuddy} />
    </>
  );
}

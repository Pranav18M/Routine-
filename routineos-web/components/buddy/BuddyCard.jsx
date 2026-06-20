'use client';
import ProgressRing from '../ui/ProgressRing';
import Button from '../ui/Button';

const MODE_EMOJIS = { normal:'🌟', exam:'📚', travel:'✈️', sick:'🤒', grind:'🔥' };

export default function BuddyCard({ buddy, onNudge, nudging, onRemove }) {
  if (!buddy) return null;
  const initials = buddy.name ? buddy.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : '?';

  return (
    <div className="card card-pad" style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#6C47FF,#A78BFA)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18, fontWeight:700, flexShrink:0, overflow:'hidden' }}>
          {buddy.avatar_url ? <img src={buddy.avatar_url} alt={buddy.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : initials}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <p style={{ fontSize:16, fontWeight:700, color:'#F4F4F8', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{buddy.name || 'Your Buddy'}</p>
            {buddy.current_mode && buddy.current_mode !== 'normal' && <span style={{ fontSize:16 }}>{MODE_EMOJIS[buddy.current_mode]}</span>}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background: buddy.loggedToday ? '#10B981' : '#252540' }} />
            <p style={{ fontSize:12, color:'#9B9BB4', margin:0 }}>{buddy.loggedToday ? 'Logged today ✓' : 'Not logged yet today'}</p>
          </div>
        </div>
        <ProgressRing percentage={buddy.consistency_score || 0} size={60} strokeWidth={5} color="#6C47FF" label={`${Math.round(buddy.consistency_score||0)}`} sublabel="%" />
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <Button fullWidth variant={buddy.loggedToday ? 'secondary' : 'primary'} onClick={onNudge} loading={nudging}>
          {buddy.loggedToday ? '👊 Send cheer' : '👊 Send nudge'}
        </Button>
        <Button variant="ghost" onClick={onRemove} size="md" style={{ flexShrink:0, padding:'13px 16px' }}>✕</Button>
      </div>
    </div>
  );
}

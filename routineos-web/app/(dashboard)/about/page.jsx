'use client';
import Header from '../../../components/layout/Header';
import PageWrapper from '../../../components/layout/PageWrapper';

const FEATURES = [
  {
    icon: '🧠',
    title: 'Smart Routine Builder',
    desc: 'Tell us your wake time, sleep time, schedule, and top goals — AI builds a realistic daily routine around your real life, not a fantasy version of it.',
  },
  {
    icon: '💙',
    title: 'Adaptive Recovery Engine',
    desc: "Miss a couple of days? No broken streaks, no guilt. Pick what got in the way — exams, travel, sickness — and we'll build you a gentle 3-day comeback plan: 40% → 70% → 100%.",
  },
  {
    icon: '🎯',
    title: 'Consistency Score, Not Streaks',
    desc: 'Instead of an all-or-nothing streak that breaks your motivation, your score is a weighted 30-day average that forgives off days and rewards real consistency.',
  },
  {
    icon: '🌗',
    title: 'Life Mode Switcher',
    desc: 'Switch between Normal, Exam, Travel, Sick, or Grind mode with one tap. Each mode shows only the habits that make sense for that season of life.',
  },
  {
    icon: '🌅',
    title: 'AI Morning Briefing',
    desc: "Every morning, get a short personal message summarizing your recent progress and what's on deck today — written by AI, grounded in your real data.",
  },
  {
    icon: '⚡',
    title: 'Micro Habit Suggestions',
    desc: "Struggling with a habit? AI suggests a 2-minute version so you never have to choose between 'all' and 'nothing.'",
  },
  {
    icon: '📊',
    title: 'Weekly Pattern Insights',
    desc: 'Every week, see your best day, toughest day, and most consistent habit — written in plain language, not just charts.',
  },
  {
    icon: '🤝',
    title: 'Accountability Buddy',
    desc: "Connect with a friend using a 6-digit code. You'll only ever see each other's consistency score — never individual habits — so it stays motivating, not invasive.",
  },
];

const STEPS = [
  { num: '1', title: 'Set up your routine', desc: 'During onboarding, tell us your schedule and top 3 goals. AI builds your starting habits.' },
  { num: '2', title: 'Check off habits daily', desc: 'Open the Today tab each day and tap a habit to mark it complete, or do the micro version if you\'re short on time.' },
  { num: '3', title: 'Switch modes when life changes', desc: 'Got exams or traveling? Tap the lightning icon on Today and switch modes — your habit list adjusts instantly.' },
  { num: '4', title: 'Let recovery handle the rest', desc: 'If you miss a couple of days, the app notices and offers a guilt-free comeback plan instead of punishing you.' },
  { num: '5', title: 'Review your insights weekly', desc: 'Check the Insights tab on Sundays to see your patterns and set an intention for the week ahead.' },
];

export default function AboutPage() {
  return (
    <>
      <Header title="About RoutineOS" subtitle="Built for real, inconsistent life" />

      <PageWrapper>
        <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:24 }}>

          {/* Hero */}
          <div className="glass-card card-pad" style={{ textAlign:'center', padding:'32px 20px' }}>
            <div style={{
              width:64, height:64, borderRadius:18, margin:'0 auto 16px', overflow:'hidden',
              boxShadow:'0 0 24px rgba(108,71,255,0.35)',
            }}>
              <img
                src="/icons/Routine logo.png"
                alt="RoutineOS"
                style={{ width:'100%', height:'100%', objectFit:'cover' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
            <h2 style={{ fontSize:22, fontWeight:800, color:'#F4F4F8', margin:0 }}>RoutineOS</h2>
            <p style={{ fontSize:14, color:'#9B9BB4', marginTop:8, lineHeight:1.6 }}>
              Every habit app fails the moment life gets inconsistent — exams, travel, illness.
              RoutineOS adapts instead of punishing you with a broken streak.
            </p>
          </div>

          {/* Features */}
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:'#9B9BB4', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>
              What you can do
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {FEATURES.map((f, i) => (
                <div key={i} className="card card-pad" style={{ display:'flex', gap:14 }}>
                  <span style={{ fontSize:24, flexShrink:0, lineHeight:1.3 }}>{f.icon}</span>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:'#F4F4F8', margin:0 }}>{f.title}</p>
                    <p style={{ fontSize:13, color:'#9B9BB4', marginTop:4, lineHeight:1.55 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to use */}
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:'#9B9BB4', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:12 }}>
              How to use it
            </p>
            <div className="card card-pad" style={{ display:'flex', flexDirection:'column', gap:18 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display:'flex', gap:14 }}>
                  <div style={{
                    width:26, height:26, borderRadius:'50%', background:'rgba(108,71,255,0.18)', color:'#A78BFA',
                    display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0,
                  }}>{s.num}</div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:600, color:'#F4F4F8', margin:0 }}>{s.title}</p>
                    <p style={{ fontSize:13, color:'#9B9BB4', marginTop:3, lineHeight:1.55 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="glass-card card-pad">
            <p style={{ fontSize:13, color:'#9B9BB4', lineHeight:1.6, margin:0 }}>
              💡 <strong style={{ color:'#F4F4F8' }}>Tip:</strong> Tap the logo at the top of any screen to open Settings,
              where you can update your schedule, timezone, and account.
            </p>
          </div>

          <p style={{ textAlign:'center', fontSize:11, color:'#5C5C78', paddingBottom:16, lineHeight:1.6 }}>
            RoutineOS · The routine that adapts to your real life
          </p>
        </div>
      </PageWrapper>
    </>
  );
}

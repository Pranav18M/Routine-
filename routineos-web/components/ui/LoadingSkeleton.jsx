'use client';

export function Skeleton({ style, className = '' }) {
  return <div className={'skel ' + className} style={style} />;
}

export function HabitCardSkeleton() {
  return (
    <div className="card card-pad" style={{ display:'flex', alignItems:'center', gap:12 }}>
      <Skeleton style={{ width:44, height:44, borderRadius:12, flexShrink:0 }} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
        <Skeleton style={{ height:16, width:'60%' }} />
        <Skeleton style={{ height:12, width:'40%' }} />
      </div>
      <Skeleton style={{ width:32, height:32, borderRadius:'50%', flexShrink:0 }} />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div className="card card-pad" style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <Skeleton style={{ height:16, width:'40%' }} />
        <Skeleton style={{ height:12, width:'100%' }} />
        <Skeleton style={{ height:12, width:'80%' }} />
      </div>
      <div className="card card-pad" style={{ display:'flex', alignItems:'center', gap:20 }}>
        <Skeleton style={{ width:80, height:80, borderRadius:'50%', flexShrink:0 }} />
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
          <Skeleton style={{ height:20, width:'40%' }} />
          <Skeleton style={{ height:12, width:'60%' }} />
        </div>
      </div>
      {[...Array(4)].map((_, i) => <HabitCardSkeleton key={i} />)}
    </div>
  );
}

export function InsightSkeleton() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div className="card card-pad" style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <Skeleton style={{ height:16, width:'33%' }} />
        <Skeleton style={{ height:12, width:'100%' }} />
        <Skeleton style={{ height:12, width:'80%' }} />
      </div>
      <div className="card card-pad">
        <Skeleton style={{ height:16, width:'40%', marginBottom:16 }} />
        <Skeleton style={{ height:128, width:'100%', borderRadius:12 }} />
      </div>
    </div>
  );
}

export default Skeleton;

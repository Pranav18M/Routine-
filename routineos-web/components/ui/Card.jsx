'use client';

export default function Card({ children, className = '', glass = false, onClick, padding = true, style, ...props }) {
  const Tag = onClick ? 'button' : 'div';
  const cls = [glass ? 'glass-card' : 'card', padding ? 'card-pad' : '', className].filter(Boolean).join(' ');
  return (
    <Tag
      onClick={onClick}
      className={cls}
      style={{ textAlign: onClick ? 'left' : undefined, width: onClick ? '100%' : undefined, cursor: onClick ? 'pointer' : undefined, border: onClick ? 'none' : undefined, font: 'inherit', color: 'inherit', ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ children, style }) {
  return <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, ...style }}>{children}</div>;
}

export function CardTitle({ children, style }) {
  return <h3 style={{ fontSize:16, fontWeight:600, color:'#F4F4F8', margin:0, ...style }}>{children}</h3>;
}

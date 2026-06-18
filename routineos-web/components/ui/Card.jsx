'use client';
import { cn } from '../../lib/utils';

export default function Card({ children, className, glass = false, onClick, padding = true, ...props }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={cn(
        glass ? 'glass-card' : 'solid-card',
        padding && 'p-4',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform duration-150 text-left w-full',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-[16px] font-semibold text-primary', className)}>
      {children}
    </h3>
  );
}
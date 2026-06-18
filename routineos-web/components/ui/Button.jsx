'use client';
import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-[#6C47FF] hover:bg-[#5035CC] text-white shadow-glow',
  secondary: 'bg-[var(--color-elevated)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)]',
  ghost: 'bg-transparent hover:bg-[var(--color-elevated)] text-[var(--color-text-primary)]',
  danger: 'bg-[rgba(239,68,68,0.15)] hover:bg-[rgba(239,68,68,0.25)] text-[#EF4444]',
  success: 'bg-[rgba(16,185,129,0.15)] hover:bg-[rgba(16,185,129,0.25)] text-[#10B981]',
  outline: 'bg-transparent border border-[var(--color-border)] hover:border-[#6C47FF] text-[var(--color-text-primary)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-[13px] rounded-[10px]',
  md: 'px-5 py-3 text-[15px] rounded-[12px]',
  lg: 'px-6 py-4 text-[16px] rounded-[14px]',
  xl: 'px-8 py-4 text-[17px] rounded-[14px]',
  icon: 'p-2.5 rounded-[10px]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  fullWidth,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold',
        'transition-all duration-[150ms] ease-out',
        'active:scale-[0.97] select-none cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{typeof children === 'string' ? children : 'Loading...'}</span>
        </>
      ) : children}
    </button>
  );
}
'use client';
import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

export default function BottomSheet({ isOpen, onClose, title, children, className }) {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm anim-fade-in"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          'relative w-full max-w-lg mx-auto slide-up-enter z-10',
          'bg-[var(--color-card)] border border-[var(--color-border)]',
          'rounded-t-[24px] shadow-2xl',
          'max-h-[90dvh] overflow-y-auto',
          className,
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--color-elevated)]" />
        </div>

        {title && (
          <div className="flex items-center justify-between px-5 pt-2 pb-4">
            <h2 className="text-[18px] font-semibold text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full
                bg-[var(--color-elevated)] text-secondary text-sm"
            >
              ✕
            </button>
          </div>
        )}

        <div className={cn('px-5 pb-8 safe-bottom', !title && 'pt-3')}>
          {children}
        </div>
      </div>
    </div>
  );
}
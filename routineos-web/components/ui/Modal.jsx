'use client';
import { useEffect } from 'react';
import { cn } from '../../lib/utils';

export default function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm anim-fade-in"
        onClick={onClose}
      />
      {/* Modal panel */}
      <div
        className={cn(
          'relative w-full max-w-sm rounded-[20px] anim-fade-scale z-10',
          'bg-[var(--color-card)] border border-[var(--color-border)]',
          'shadow-2xl',
          className,
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
            <h2 className="text-[18px] font-semibold text-primary">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full
                bg-[var(--color-elevated)] text-secondary hover:text-primary
                transition-colors duration-150 text-lg leading-none"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
'use client';
import { useEffect } from 'react';
import useStore from '../../store/useStore';
import { cn } from '../../lib/utils';

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

const styles = {
  success: 'border-[#10B981] bg-[rgba(16,185,129,0.12)] text-[#10B981]',
  error: 'border-[#EF4444] bg-[rgba(239,68,68,0.12)] text-[#EF4444]',
  info: 'border-[#6C47FF] bg-[rgba(108,71,255,0.12)] text-[#A78BFA]',
  warning: 'border-[#F59E0B] bg-[rgba(245,158,11,0.12)] text-[#F59E0B]',
};

function Toast({ id, type = 'info', message }) {
  const { removeToast } = useStore();

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-[14px] border',
        'shadow-lg backdrop-blur-sm anim-fade-up',
        'max-w-[340px] w-full cursor-pointer',
        styles[type] || styles.info,
      )}
      onClick={() => removeToast(id)}
    >
      <span className="text-[15px] font-bold shrink-0 w-5 h-5 flex items-center justify-center">
        {icons[type]}
      </span>
      <p className="text-[14px] font-medium text-[var(--color-text-primary)] flex-1 leading-snug">
        {message}
      </p>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useStore();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-[200] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto w-full flex justify-center">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}
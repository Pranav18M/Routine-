'use client';
import { cn } from '../../lib/utils';

export default function PageWrapper({ children, className, noPadding = false }) {
  return (
    <main
      className={cn(
        'min-h-dvh bg-[var(--color-bg)]',
        !noPadding && 'page-container',
        className,
      )}
    >
      {children}
    </main>
  );
}
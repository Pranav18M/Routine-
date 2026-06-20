'use client';
import { SHARED_STYLES } from '../../lib/sharedStyles';

export default function PageWrapper({ children, noPadding = false }) {
  return (
    <>
      <style>{SHARED_STYLES}</style>
      <main className="pg-root">
        <div className={noPadding ? '' : 'pg-content'}>
          {children}
        </div>
      </main>
    </>
  );
}

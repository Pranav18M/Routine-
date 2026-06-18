'use client';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function MorningBriefing({ text, userName }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const lines = text.split('\n').filter(Boolean);
  const preview = lines[0];
  const hasMore = lines.length > 1;

  return (
    <div className="glass-card p-5 anim-fade-up" style={{ borderColor: 'rgba(108,71,255,0.2)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🌅</span>
        <p className="text-[12px] font-semibold text-[#A78BFA] uppercase tracking-wider">
          Morning Briefing
        </p>
      </div>
      <div className={cn('space-y-1.5 overflow-hidden transition-all duration-300')}>
        {(expanded ? lines : [preview]).map((line, i) => (
          <p key={i} className="text-[14px] text-primary leading-relaxed">
            {line}
          </p>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-2 text-[12px] font-semibold text-[#6C47FF] hover:opacity-80 transition-opacity"
        >
          {expanded ? 'Show less ↑' : 'Read more ↓'}
        </button>
      )}
    </div>
  );
}
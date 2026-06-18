'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/layout/Header';
import PageWrapper from '../../../components/layout/PageWrapper';
import BuddyCard from '../../../components/buddy/BuddyCard';
import InviteModal from '../../../components/buddy/InviteModal';
import Button from '../../../components/ui/Button';
import { HabitCardSkeleton } from '../../../components/ui/LoadingSkeleton';
import { useBuddy } from '../../../hooks/useBuddy';

export default function BuddyPage() {
  const { buddy, inviteCode, loading, nudging, fetchBuddy, fetchInviteCode, connectBuddy, removeBuddy, nudgeBuddy } = useBuddy();
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    fetchBuddy();
    fetchInviteCode();
  }, []);

  return (
    <>
      <Header
        title="Accountability Buddy"
        subtitle="Stay on track together"
      />

      <PageWrapper>
        {loading ? (
          <div className="space-y-4">
            <HabitCardSkeleton />
            <HabitCardSkeleton />
          </div>
        ) : buddy ? (
          <div className="space-y-4 stagger-children">
            <BuddyCard
              buddy={buddy}
              onNudge={nudgeBuddy}
              nudging={nudging}
              onRemove={removeBuddy}
            />

            {/* Privacy note */}
            <div className="glass-card p-4" style={{ borderColor: 'rgba(108,71,255,0.15)' }}>
              <p className="text-[13px] text-secondary leading-relaxed">
                🔒 <strong className="text-primary">Privacy:</strong> You can only see each other's
                consistency score — not individual habits or notes. Your routine stays private.
              </p>
            </div>

            {/* Your code */}
            <div className="solid-card p-4">
              <p className="text-[13px] font-semibold text-secondary mb-2">Your invite code</p>
              <div className="flex items-center gap-3">
                <p className="text-[22px] font-bold text-primary tracking-[6px] flex-1">
                  {inviteCode || '------'}
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(inviteCode)}
                  className="text-[12px] font-semibold text-[#6C47FF]"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 stagger-children">
            {/* Empty state */}
            <div className="text-center py-10">
              <p className="text-5xl mb-4">🤝</p>
              <h2 className="text-[20px] font-bold text-primary">No buddy yet</h2>
              <p className="text-[14px] text-secondary mt-2 leading-relaxed max-w-[260px] mx-auto">
                Connect with a friend to keep each other accountable. You'll only see their consistency score.
              </p>
            </div>

            <Button fullWidth size="lg" onClick={() => setInviteOpen(true)}>
              Connect with a buddy
            </Button>

            {/* How it works */}
            <div className="solid-card p-5 space-y-4">
              <p className="text-[14px] font-semibold text-primary">How it works</p>
              {[
                { emoji: '1️⃣', text: 'Share your 6-digit invite code with a friend' },
                { emoji: '2️⃣', text: 'They enter your code (or you enter theirs)' },
                { emoji: '3️⃣', text: "See each other's score and send nudges" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{step.emoji}</span>
                  <p className="text-[13px] text-secondary leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageWrapper>

      <InviteModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        inviteCode={inviteCode}
        onConnect={connectBuddy}
      />
    </>
  );
}
'use client';
import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useStore from '../../store/useStore';

export default function InviteModal({ isOpen, onClose, inviteCode, onConnect }) {
  const [inputCode, setInputCode] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleConnect = async () => {
    if (!inputCode.trim() || inputCode.trim().length !== 6) {
      addToast({ type: 'error', message: 'Enter a valid 6-character code' });
      return;
    }
    setConnecting(true);
    await onConnect(inputCode.trim());
    setConnecting(false);
    setInputCode('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Accountability Buddy">
      <div className="space-y-6">
        {/* Your code */}
        <div>
          <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">
            Your invite code
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[var(--color-elevated)] rounded-[12px] px-4 py-3
              text-center text-[22px] font-bold text-primary tracking-[6px] border border-[var(--color-border)]">
              {inviteCode || '------'}
            </div>
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </Button>
          </div>
          <p className="text-[11px] text-muted mt-2 text-center">
            Share this code with a friend to connect
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-[12px] text-muted">or enter theirs</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        {/* Enter a code */}
        <div>
          <p className="text-[12px] font-semibold text-secondary uppercase tracking-wider mb-2">
            Enter buddy's code
          </p>
          <input
            type="text"
            value={inputCode}
            onChange={e => setInputCode(e.target.value.toUpperCase().slice(0, 6))}
            placeholder="ABCD12"
            maxLength={6}
            className="w-full bg-[var(--color-elevated)] border border-[var(--color-border)]
              rounded-[12px] px-4 py-3 text-center text-[20px] font-bold text-primary
              tracking-[6px] uppercase placeholder:text-muted placeholder:tracking-normal
              focus:outline-none focus:border-[#6C47FF] transition-colors"
          />
          <Button
            fullWidth
            className="mt-3"
            disabled={inputCode.length !== 6}
            loading={connecting}
            onClick={handleConnect}
          >
            Connect as buddies
          </Button>
        </div>

        <p className="text-[11px] text-muted text-center leading-relaxed">
          Buddies can only see each other's consistency score — not individual habits.
        </p>
      </div>
    </Modal>
  );
}
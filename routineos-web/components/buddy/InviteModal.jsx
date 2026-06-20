'use client';
import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useStore from '../../store/useStore';

export default function InviteModal({ isOpen, onClose, inviteCode, onConnect }) {
  const [inputCode, setInputCode] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleConnect = async () => {
    if (!inputCode.trim() || inputCode.trim().length !== 6) {
      addToast({ type:'error', message:'Enter a valid 6-character code' });
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
      <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
        <div>
          <p className="field-label" style={{ textTransform:'uppercase', fontWeight:600 }}>Your invite code</p>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ flex:1, background:'#252540', borderRadius:12, padding:'12px 16px', textAlign:'center', fontSize:22, fontWeight:700, color:'#F4F4F8', letterSpacing:6, border:'1px solid rgba(255,255,255,0.08)' }}>
              {inviteCode || '------'}
            </div>
            <Button variant="secondary" onClick={handleCopy}>{copied ? '✓ Copied!' : 'Copy'}</Button>
          </div>
          <p style={{ fontSize:11, color:'#5C5C78', marginTop:8, textAlign:'center' }}>Share this code with a friend to connect</p>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize:12, color:'#5C5C78' }}>or enter theirs</span>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
        </div>

        <div>
          <p className="field-label" style={{ textTransform:'uppercase', fontWeight:600 }}>Enter buddy's code</p>
          <input
            type="text" value={inputCode} onChange={e => setInputCode(e.target.value.toUpperCase().slice(0,6))}
            placeholder="ABCD12" maxLength={6}
            style={{ width:'100%', background:'#252540', border:'1.5px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'12px 16px', textAlign:'center', fontSize:20, fontWeight:700, color:'#F4F4F8', letterSpacing:6, textTransform:'uppercase', outline:'none' }}
          />
          <Button fullWidth style={{ marginTop:12 }} disabled={inputCode.length !== 6} loading={connecting} onClick={handleConnect}>
            Connect as buddies
          </Button>
        </div>

        <p style={{ fontSize:11, color:'#5C5C78', textAlign:'center', lineHeight:1.5 }}>
          Buddies can only see each other's consistency score — not individual habits.
        </p>
      </div>
    </Modal>
  );
}

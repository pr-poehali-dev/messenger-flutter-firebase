import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface IncomingCallProps {
  name: string;
  avatar: string;
  color: string;
  isVideo: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCall = ({ name, avatar, color, isVideo, onAccept, onDecline }: IncomingCallProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 transition-all duration-500"
      style={{
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        className="w-80 rounded-3xl p-5 flex flex-col gap-4 relative overflow-hidden animate-call-glow"
        style={{
          background: 'linear-gradient(135deg, #1a0d2e, #0d1a2e)',
          border: `1px solid ${color}55`,
          ['--call-color' as string]: `${color}44`,
        }}
      >
        {/* Blur bg blob */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{ background: color }}
        />

        {/* Type label */}
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: 'var(--neon-green)', boxShadow: '0 0 8px var(--neon-green)' }}
          />
          <span className="text-xs text-white/40 font-medium">
            Входящий {isVideo ? 'видео' : 'голосовой'} звонок
          </span>
        </div>

        {/* Caller info */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0 w-14 h-14">
            {/* Ripple rings */}
            <span
              className="call-ripple absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: `${color}33` }}
            />
            <span
              className="call-ripple-2 absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: `${color}22` }}
            />
            <span
              className="call-ripple-3 absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: `${color}11` }}
            />
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold relative z-10"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}88)`,
                boxShadow: `0 0 20px ${color}55`,
              }}
            >
              {avatar}
            </div>
            <span
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-20 animate-phone-ring"
              style={{ background: isVideo ? 'var(--neon-cyan)' : 'var(--neon-green)' }}
            >
              <Icon name={isVideo ? 'Video' : 'Phone'} size={10} className="text-white" />
            </span>
          </div>
          <div>
            <p className="font-bold text-white text-base leading-tight">{name}</p>
            <p className="text-xs text-white/40 mt-0.5">
              {isVideo ? 'Видеозвонок' : 'Голосовой звонок'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onDecline}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.35)',
              color: '#f87171',
            }}
          >
            <Icon name="PhoneOff" size={16} />
            Отклонить
          </button>
          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
            }}
          >
            <Icon name={isVideo ? 'Video' : 'Phone'} size={16} />
            Ответить
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
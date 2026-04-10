import { useState, useEffect } from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface CallScreenProps {
  name: string;
  avatar: string;
  color: string;
  isVideo: boolean;
  onEnd: () => void;
}

const CallScreen = ({ name, avatar, color, isVideo, onEnd }: CallScreenProps) => {
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(isVideo);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between py-12 px-6"
      style={{
        background: isVideo
          ? 'linear-gradient(180deg, #0d0f1a 0%, #1a0a2e 50%, #0a1a2e 100%)'
          : 'linear-gradient(180deg, #0d0f1a 0%, #1a0a2e 100%)',
      }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: color }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full opacity-10 blur-3xl"
          style={{ background: 'var(--neon-cyan)' }}
        />
      </div>

      {/* Top info */}
      <div className="relative flex flex-col items-center gap-1 text-center">
        <span
          className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
          style={{ background: 'rgba(168,85,247,0.2)', color: 'var(--neon-purple)' }}
        >
          {isVideo ? 'Видеозвонок' : 'Голосовой звонок'}
        </span>
        <p className="text-white/40 text-sm">Идёт звонок</p>
        <p className="text-2xl font-bold text-white font-display mt-1">{name}</p>
        <p className="text-lg font-mono mt-2" style={{ color: 'var(--neon-cyan)' }}>
          {formatTime(seconds)}
        </p>
      </div>

      {/* Avatar */}
      <div className="relative flex items-center justify-center">
        {/* Pulse rings */}
        <div
          className="absolute w-48 h-48 rounded-full animate-ping opacity-10"
          style={{ background: color }}
        />
        <div
          className="absolute w-36 h-36 rounded-full animate-ping opacity-15"
          style={{ background: color, animationDelay: '0.5s' }}
        />
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold relative"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}88)`,
            boxShadow: `0 0 0 4px ${color}44, 0 0 40px ${color}55`,
          }}
        >
          {avatar}
        </div>
      </div>

      {/* Controls */}
      <div className="relative w-full flex flex-col items-center gap-6">
        <div className="flex items-center gap-5">
          {/* Mute */}
          <button
            onClick={() => setMuted((v) => !v)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
              style={{
                background: muted ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)',
                border: muted ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Icon
                name={muted ? 'MicOff' : 'Mic'}
                size={22}
                style={{ color: muted ? '#f87171' : 'rgba(255,255,255,0.7)' }}
              />
            </div>
            <span className="text-xs text-white/40">{muted ? 'Вкл. звук' : 'Выкл. звук'}</span>
          </button>

          {/* End call */}
          <button
            onClick={onEnd}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-18 h-18 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                boxShadow: '0 6px 25px rgba(239,68,68,0.5)',
                width: '72px',
                height: '72px',
              }}
            >
              <Icon name="PhoneOff" size={28} className="text-white" />
            </div>
            <span className="text-xs text-white/40">Завершить</span>
          </button>

          {/* Speaker / Camera */}
          {isVideo ? (
            <button
              onClick={() => setCameraOn((v) => !v)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: !cameraOn ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)',
                  border: !cameraOn ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Icon
                  name={cameraOn ? 'Video' : 'VideoOff'}
                  size={22}
                  style={{ color: !cameraOn ? '#f87171' : 'rgba(255,255,255,0.7)' }}
                />
              </div>
              <span className="text-xs text-white/40">{cameraOn ? 'Камера' : 'Камера выкл.'}</span>
            </button>
          ) : (
            <button
              onClick={() => setSpeakerOn((v) => !v)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
                style={{
                  background: speakerOn ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.08)',
                  border: speakerOn ? '1px solid rgba(168,85,247,0.4)' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Icon
                  name={speakerOn ? 'Volume2' : 'VolumeX'}
                  size={22}
                  style={{ color: speakerOn ? 'var(--neon-purple)' : 'rgba(255,255,255,0.7)' }}
                />
              </div>
              <span className="text-xs text-white/40">Громкость</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallScreen;

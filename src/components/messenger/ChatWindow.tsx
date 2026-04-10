import { useState, useRef, useEffect } from 'react';
import { Chat, Message } from '@/data/mockData';
import Avatar from './Avatar';
import TypingIndicator from './TypingIndicator';
import CallScreen from './CallScreen';
import Icon from '@/components/ui/icon';

interface ChatWindowProps {
  chat: Chat;
}

const playReceiveSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();

    // Мягкий низкий «pop» — нота поднимается вверх
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(380, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.1);
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.13, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc1.connect(g1);
    g1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.18);

    // Лёгкий второй тон чуть позже
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(520, ctx.currentTime + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.16);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.07, ctx.currentTime + 0.06);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc2.connect(g2);
    g2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.06);
    osc2.stop(ctx.currentTime + 0.2);

    setTimeout(() => ctx.close(), 400);
  } catch { /* молча игнорируем */ }
};

const playSendSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.12, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    master.connect(ctx.destination);

    // Короткий высокий щелчок + мягкий «whoosh»
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    osc1.connect(master);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.12);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(900, ctx.currentTime + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.07, ctx.currentTime + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc2.connect(g2);
    g2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.02);
    osc2.stop(ctx.currentTime + 0.12);

    setTimeout(() => ctx.close(), 300);
  } catch { /* браузер заблокировал — молча игнорируем */ }
};

const ChatWindow = ({ chat }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(chat.typing ?? false);
  const [activeCall, setActiveCall] = useState<{ isVideo: boolean } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMessages(chat.messages);
    setIsTyping(chat.typing ?? false);
    setActiveCall(null);
  }, [chat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      text: input.trim(),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isOut: true,
      status: 'sent',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    playSendSound();

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    setIsTyping(true);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: `m${Date.now() + 1}`,
        text: 'Понял, спасибо! 👍',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isOut: false,
      };
      setMessages((prev) => [...prev, reply]);
      playReceiveSound();
    }, 2500);
  };

  const startCall = (isVideo: boolean) => {
    setActiveCall({ isVideo });
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Active call overlay */}
      {activeCall && (
        <CallScreen
          name={chat.name}
          avatar={chat.avatar}
          color={chat.color}
          isVideo={activeCall.isVideo}
          onEnd={() => setActiveCall(null)}
        />
      )}

      {/* Header */}
      <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <Avatar label={chat.avatar} color={chat.color} size="md" online={chat.online} ring />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white/90 flex items-center gap-2">
            {chat.name}
            {chat.isGroup && <Icon name="Users" size={14} className="text-white/40" />}
          </div>
          <div className="text-xs">
            {isTyping ? (
              <span style={{ color: 'var(--neon-purple)' }} className="animate-pulse">
                печатает...
              </span>
            ) : chat.online ? (
              <span style={{ color: 'var(--neon-green)' }}>в сети</span>
            ) : (
              <span className="text-white/30">не в сети</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => startCall(false)}
            className="p-2 rounded-xl hover:bg-white/5 transition-all text-white/40 hover:text-[var(--neon-green)] relative group"
            title="Голосовой звонок"
          >
            <Icon name="Phone" size={18} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] text-white/70 text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
              Звонок
            </span>
          </button>
          <button
            onClick={() => startCall(true)}
            className="p-2 rounded-xl hover:bg-white/5 transition-all text-white/40 hover:text-[var(--neon-cyan)] relative group"
            title="Видеозвонок"
          >
            <Icon name="Video" size={18} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--bg-elevated)] text-white/70 text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
              Видео
            </span>
          </button>
          <button className="p-2 rounded-xl hover:bg-white/5 transition-colors text-white/40 hover:text-white/70">
            <Icon name="MoreVertical" size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 animate-msg ${msg.isOut ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {!msg.isOut && (
              <Avatar label={chat.avatar} color={chat.color} size="sm" />
            )}
            <div
              className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                msg.isOut
                  ? 'msg-out rounded-br-sm text-white'
                  : 'msg-in rounded-bl-sm text-white/90'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.isOut ? 'justify-end' : 'justify-start'}`}>
                <span className="text-xs opacity-50">{msg.time}</span>
                {msg.isOut && msg.status === 'read' && (
                  <Icon name="CheckCheck" size={12} style={{ color: 'var(--neon-cyan)' }} />
                )}
                {msg.isOut && msg.status === 'sent' && (
                  <Icon name="Check" size={12} className="opacity-50" />
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass border-t border-white/5 p-3 flex items-end gap-3 flex-shrink-0">
        <button className="p-2 rounded-xl hover:bg-white/5 transition-colors text-white/40 hover:text-white/70 flex-shrink-0">
          <Icon name="Paperclip" size={20} />
        </button>
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Написать сообщение..."
            rows={1}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white/90 placeholder-white/25 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
            style={{ maxHeight: '120px' }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2.5 rounded-2xl flex-shrink-0 transition-all duration-200 disabled:opacity-30"
          style={{
            background: input.trim() ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.05)',
            boxShadow: input.trim() ? '0 4px 20px rgba(168,85,247,0.4)' : 'none',
          }}
        >
          <Icon name="Send" size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
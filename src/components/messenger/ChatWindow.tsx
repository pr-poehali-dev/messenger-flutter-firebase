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
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(380, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.1);
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.13, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc1.connect(g1); g1.connect(ctx.destination);
    osc1.start(); osc1.stop(ctx.currentTime + 0.18);
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(520, ctx.currentTime + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.16);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.07, ctx.currentTime + 0.06);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc2.connect(g2); g2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.06); osc2.stop(ctx.currentTime + 0.2);
    setTimeout(() => ctx.close(), 400);
  } catch { /* ignore */ }
};

const playSendSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.12, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    master.connect(ctx.destination);
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
    osc1.connect(master); osc1.start(); osc1.stop(ctx.currentTime + 0.12);
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(900, ctx.currentTime + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.07, ctx.currentTime + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc2.connect(g2); g2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.02); osc2.stop(ctx.currentTime + 0.12);
    setTimeout(() => ctx.close(), 300);
  } catch { /* ignore */ }
};

const ChatWindow = ({ chat }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(chat.typing ?? false);
  const [activeCall, setActiveCall] = useState<{ isVideo: boolean } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(chat.messages);
    setIsTyping(chat.typing ?? false);
    setActiveCall(null);
  }, [chat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const updateStatus = (id: string, status: Message['status']) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const id = `m${Date.now()}`;
    const newMsg: Message = {
      id,
      text: input.trim(),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isOut: true,
      status: 'sent',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    playSendSound();
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setTimeout(() => updateStatus(id, 'delivered'), 600);
    setTimeout(() => updateStatus(id, 'read'), 1400);

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

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: 'var(--surface-1)' }}>
      {activeCall && (
        <CallScreen
          name={chat.name}
          avatar={chat.avatar}
          color={chat.color}
          isVideo={activeCall.isVideo}
          onEnd={() => setActiveCall(null)}
        />
      )}

      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background: 'var(--surface-0)',
          borderBottom: '1px solid var(--sidebar-border)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <Avatar label={chat.avatar} color={chat.color} size="md" online={chat.online} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[15px] leading-snug flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
            {chat.name}
            {chat.isGroup && <Icon name="Users" size={13} style={{ color: 'var(--text-tertiary)' }} />}
          </p>
          <p className="text-xs leading-tight" style={{ color: isTyping ? 'var(--tg-blue)' : chat.online ? 'var(--tg-green)' : 'var(--text-tertiary)' }}>
            {isTyping ? 'печатает...' : chat.online ? 'в сети' : 'не в сети'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveCall({ isVideo: false })}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--surface-1)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Icon name="Phone" size={18} />
          </button>
          <button
            onClick={() => setActiveCall({ isVideo: true })}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--surface-1)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Icon name="Video" size={18} />
          </button>
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--surface-1)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Icon name="MoreVertical" size={18} />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1"
        style={{ background: 'var(--surface-1)' }}
      >
        {messages.map((msg, i) => {
          const prevIsOut = i > 0 ? messages[i - 1].isOut : null;
          const isFirst = prevIsOut !== msg.isOut;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 animate-msg ${msg.isOut ? 'flex-row-reverse' : 'flex-row'} ${isFirst ? 'mt-2' : 'mt-0.5'}`}
            >
              {!msg.isOut && (
                <div style={{ width: 28, flexShrink: 0 }}>
                  {isFirst && <Avatar label={chat.avatar} color={chat.color} size="sm" />}
                </div>
              )}
              <div className={`max-w-[68%] ${msg.isOut ? 'bubble-out' : 'bubble-in'} px-3.5 py-2`}>
                <p className="text-[14.5px] leading-relaxed">{msg.text}</p>
                <div className={`flex items-center gap-1 mt-0.5 ${msg.isOut ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[11px]" style={{ opacity: msg.isOut ? 0.75 : 0.45 }}>{msg.time}</span>
                  {msg.isOut && (
                    <span className="inline-flex">
                      {msg.status === 'sent' && (
                        <Icon name="Check" size={12} style={{ opacity: 0.6, color: 'inherit' }} />
                      )}
                      {msg.status === 'delivered' && (
                        <Icon name="CheckCheck" size={12} style={{ opacity: 0.75, color: 'inherit' }} className="animate-scale-in" />
                      )}
                      {msg.status === 'read' && (
                        <Icon name="CheckCheck" size={12} style={{ color: '#90e0ff' }} className="animate-scale-in" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && <div className="mt-2"><TypingIndicator /></div>}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div
        className="flex-shrink-0 px-3 py-3 flex items-end gap-2"
        style={{
          background: 'var(--surface-0)',
          borderTop: '1px solid var(--sidebar-border)',
        }}
      >
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-[var(--surface-1)]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <Icon name="Paperclip" size={20} />
        </button>

        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder="Сообщение..."
            rows={1}
            className="msg-input w-full block"
            style={{ maxHeight: 120 }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="send-btn w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40"
        >
          <Icon name="Send" size={18} className="text-white" style={{ marginLeft: 2 }} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;

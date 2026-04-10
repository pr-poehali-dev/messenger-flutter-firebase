const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-2 animate-fade-up">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #a855f7, #22d3ee)' }}
      >
        АП
      </div>
      <div className="msg-in rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        <span
          className="typing-dot w-2 h-2 rounded-full"
          style={{ background: 'var(--neon-purple)' }}
        />
        <span
          className="typing-dot w-2 h-2 rounded-full"
          style={{ background: 'var(--neon-cyan)' }}
        />
        <span
          className="typing-dot w-2 h-2 rounded-full"
          style={{ background: 'var(--neon-pink)' }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;

const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-2 animate-fade-up">
      <div className="bubble-in px-4 py-3 flex items-center gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-tertiary)' }} />
        <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-tertiary)' }} />
        <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--text-tertiary)' }} />
      </div>
    </div>
  );
};

export default TypingIndicator;
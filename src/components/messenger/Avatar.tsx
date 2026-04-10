interface AvatarProps {
  label: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  ring?: boolean;
}

const sizes = {
  sm: { box: 'w-8 h-8',   text: 'text-[11px]', dot: 'w-2.5 h-2.5 border-[1.5px]' },
  md: { box: 'w-10 h-10', text: 'text-[13px]', dot: 'w-3 h-3 border-2' },
  lg: { box: 'w-14 h-14', text: 'text-[16px]', dot: 'w-3.5 h-3.5 border-2' },
};

const Avatar = ({ label, color, size = 'md', online, ring }: AvatarProps) => {
  const s = sizes[size];
  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${s.box} rounded-full flex items-center justify-center font-semibold select-none ${ring ? 'avatar-ring' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${color}ee, ${color}99)`,
          boxShadow: ring ? undefined : `0 2px 8px ${color}44`,
          color: '#fff',
          fontSize: s.text.replace('text-[', '').replace(']', ''),
          letterSpacing: '0.02em',
        }}
      >
        {label}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 ${s.dot} rounded-full border-[var(--surface-0)] online-dot ${
            online ? 'bg-[var(--tg-green)]' : 'bg-[var(--text-tertiary)]'
          }`}
          style={{ borderColor: 'var(--surface-0)' }}
        />
      )}
    </div>
  );
};

export default Avatar;

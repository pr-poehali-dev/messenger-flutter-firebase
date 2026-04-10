interface AvatarProps {
  label: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean;
  ring?: boolean;
}

const sizes = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
};

const Avatar = ({ label, color, size = 'md', online, ring }: AvatarProps) => {
  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold ${ring ? 'avatar-ring' : ''}`}
        style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
      >
        {label}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg-deep)] online-dot ${
            online ? 'bg-[var(--neon-green)]' : 'bg-gray-500'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;

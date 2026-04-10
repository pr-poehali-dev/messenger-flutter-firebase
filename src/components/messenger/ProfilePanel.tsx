import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const ProfilePanel = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Hero */}
      <div
        className="relative px-4 pt-8 pb-6 flex flex-col items-center text-center"
        style={{
          background: 'linear-gradient(180deg, rgba(120,40,200,0.3) 0%, transparent 100%)',
        }}
      >
        <div className="relative mb-4">
          <Avatar label="ВЫ" color="#a855f7" size="lg" ring />
          <button
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <Icon name="Camera" size={12} />
          </button>
        </div>
        <h2 className="text-xl font-bold gradient-text font-display">Алексей Громов</h2>
        <p className="text-sm text-white/40 mt-1">@alex_gromov</p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] online-dot" />
          <span className="text-xs" style={{ color: 'var(--neon-green)' }}>В сети</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 mb-4">
        {[
          { label: 'Чатов', value: '6', color: 'var(--neon-purple)' },
          { label: 'Контактов', value: '7', color: 'var(--neon-cyan)' },
          { label: 'Групп', value: '2', color: 'var(--neon-pink)' },
        ].map((stat) => (
          <div key={stat.label} className="glass-light rounded-2xl p-3 text-center">
            <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="px-4 space-y-2">
        {[
          { icon: 'Phone', label: 'Телефон', value: '+7 999 000-00-00' },
          { icon: 'Mail', label: 'Email', value: 'alex@example.com' },
          { icon: 'MapPin', label: 'Город', value: 'Москва, Россия' },
          { icon: 'Calendar', label: 'Зарегистрирован', value: 'Январь 2024' },
        ].map((item) => (
          <div key={item.label} className="glass-light rounded-2xl px-4 py-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(168,85,247,0.15)' }}
            >
              <Icon name={item.icon} size={16} className="text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-white/30">{item.label}</p>
              <p className="text-sm text-white/80">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit button */}
      <div className="px-4 mt-4">
        <button
          className="w-full py-3 rounded-2xl font-semibold text-sm text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 20px rgba(168,85,247,0.3)' }}
        >
          Редактировать профиль
        </button>
      </div>
    </div>
  );
};

export default ProfilePanel;
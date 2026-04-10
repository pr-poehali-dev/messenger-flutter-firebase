import { useState } from 'react';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

type CallType = 'incoming' | 'outgoing' | 'missed';

interface CallRecord {
  id: string;
  name: string;
  avatar: string;
  color: string;
  type: CallType;
  isVideo: boolean;
  time: string;
  duration?: string;
}

const callHistory: CallRecord[] = [
  { id: 'c1', name: 'Алиса Петрова',   avatar: 'АП', color: '#a855f7', type: 'incoming', isVideo: false, time: 'Сегодня, 14:35', duration: '5 мин 12 сек' },
  { id: 'c2', name: 'Михаил Соколов',  avatar: 'МС', color: '#f472b6', type: 'missed',   isVideo: false, time: 'Сегодня, 12:10' },
  { id: 'c3', name: 'Андрей Новиков',  avatar: 'АН', color: '#818cf8', type: 'outgoing', isVideo: true,  time: 'Сегодня, 10:02', duration: '18 мин 44 сек' },
  { id: 'c4', name: 'Катя Иванова',    avatar: 'КИ', color: '#fb923c', type: 'missed',   isVideo: false, time: 'Вчера, 19:55' },
  { id: 'c5', name: 'Алиса Петрова',   avatar: 'АП', color: '#a855f7', type: 'outgoing', isVideo: false, time: 'Вчера, 17:30', duration: '2 мин 08 сек' },
  { id: 'c6', name: 'Денис Козлов',    avatar: 'ДК', color: '#f59e0b', type: 'incoming', isVideo: true,  time: 'Вчера, 11:15', duration: '32 мин 01 сек' },
  { id: 'c7', name: 'Наташа Смирнова', avatar: 'НС', color: '#4ade80', type: 'missed',   isVideo: true,  time: '2 дня назад' },
  { id: 'c8', name: 'Сергей Попов',    avatar: 'СП', color: '#22d3ee', type: 'outgoing', isVideo: false, time: '3 дня назад', duration: '8 мин 55 сек' },
];

const typeConfig: Record<CallType, { icon: string; color: string; label: string }> = {
  incoming: { icon: 'PhoneIncoming', color: 'var(--neon-green)',  label: 'Входящий' },
  outgoing: { icon: 'PhoneOutgoing', color: 'var(--neon-cyan)',   label: 'Исходящий' },
  missed:   { icon: 'PhoneMissed',   color: '#f87171',            label: 'Пропущенный' },
};

type Filter = 'all' | 'missed';

const ProfilePanel = () => {
  const [filter, setFilter] = useState<Filter>('all');

  const displayed = filter === 'missed'
    ? callHistory.filter((c) => c.type === 'missed')
    : callHistory;

  const missedCount = callHistory.filter((c) => c.type === 'missed').length;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Hero */}
      <div
        className="relative px-4 pt-8 pb-6 flex flex-col items-center text-center flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, rgba(120,40,200,0.3) 0%, transparent 100%)' }}
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
      <div className="grid grid-cols-3 gap-3 px-4 mb-4 flex-shrink-0">
        {[
          { label: 'Чатов',     value: '6', color: 'var(--neon-purple)' },
          { label: 'Контактов', value: '7', color: 'var(--neon-cyan)' },
          { label: 'Групп',     value: '2', color: 'var(--neon-pink)' },
        ].map((stat) => (
          <div key={stat.label} className="glass-light rounded-2xl p-3 text-center">
            <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="px-4 space-y-2 flex-shrink-0">
        {[
          { icon: 'Phone',    label: 'Телефон',        value: '+7 999 000-00-00' },
          { icon: 'Mail',     label: 'Email',           value: 'alex@example.com' },
          { icon: 'MapPin',   label: 'Город',           value: 'Москва, Россия' },
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

      {/* Call history */}
      <div className="px-4 mt-5 flex-shrink-0">
        {/* Section header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name="PhoneCall" size={15} className="text-purple-400" />
            <span className="text-sm font-bold text-white/80">История звонков</span>
          </div>
          <div className="flex items-center gap-1 p-0.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {(['all', 'missed'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 relative"
                style={{
                  background: filter === f ? 'linear-gradient(135deg, rgba(124,58,237,0.6), rgba(168,85,247,0.4))' : 'transparent',
                  color: filter === f ? '#fff' : 'rgba(255,255,255,0.35)',
                }}
              >
                {f === 'all' ? 'Все' : 'Пропущенные'}
                {f === 'missed' && missedCount > 0 && (
                  <span
                    className="ml-1 px-1 py-0 rounded-full text-[9px] font-bold text-white"
                    style={{ background: '#ef4444' }}
                  >
                    {missedCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-1.5">
          {displayed.map((call, i) => {
            const cfg = typeConfig[call.type];
            return (
              <div
                key={call.id}
                className="flex items-center gap-3 p-3 rounded-2xl glass-light hover:bg-white/5 transition-all group animate-fade-up"
                style={{ animationDelay: `${i * 35}ms` }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `linear-gradient(135deg, ${call.color}, ${call.color}88)` }}
                  >
                    {call.avatar}
                  </div>
                  {/* Video badge */}
                  {call.isVideo && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--neon-cyan)' }}
                    >
                      <Icon name="Video" size={8} className="text-white" />
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white/85 truncate leading-tight">{call.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Icon name={cfg.icon} size={11} style={{ color: cfg.color }} />
                    <span className="text-xs" style={{ color: cfg.color }}>{cfg.label}</span>
                    {call.duration && (
                      <>
                        <span className="text-white/20 text-xs">·</span>
                        <span className="text-xs text-white/30">{call.duration}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Time + callback */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-xs text-white/25">{call.time}</span>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-white/10"
                    title="Перезвонить"
                  >
                    <Icon name="Phone" size={13} style={{ color: 'var(--neon-green)' }} />
                  </button>
                </div>
              </div>
            );
          })}

          {displayed.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
              <Icon name="PhoneMissed" size={32} className="text-white/15" />
              <p className="text-xs text-white/30">Пропущенных звонков нет</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit button */}
      <div className="px-4 mt-5 flex-shrink-0">
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

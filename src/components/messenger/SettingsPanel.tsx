import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
}

const Toggle = ({ value, onChange }: ToggleProps) => (
  <button
    onClick={() => onChange(!value)}
    className="relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0"
    style={{ background: value ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.1)' }}
  >
    <span
      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow"
      style={{ left: value ? '24px' : '4px' }}
    />
  </button>
);

const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    sounds: true,
    readReceipts: true,
    typingIndicator: true,
    darkMode: true,
    compactMode: false,
    autoDownload: false,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    {
      title: 'Уведомления',
      icon: 'Bell',
      color: 'var(--neon-purple)',
      items: [
        { key: 'notifications', label: 'Push-уведомления', desc: 'Получать уведомления о новых сообщениях' },
        { key: 'sounds', label: 'Звуки', desc: 'Воспроизводить звук при новом сообщении' },
      ],
    },
    {
      title: 'Приватность',
      icon: 'Shield',
      color: 'var(--neon-cyan)',
      items: [
        { key: 'readReceipts', label: 'Отчёты о прочтении', desc: 'Показывать когда вы прочитали сообщение' },
        { key: 'typingIndicator', label: 'Индикатор печати', desc: 'Показывать когда вы печатаете' },
      ],
    },
    {
      title: 'Внешний вид',
      icon: 'Palette',
      color: 'var(--neon-pink)',
      items: [
        { key: 'darkMode', label: 'Тёмная тема', desc: 'Использовать тёмное оформление' },
        { key: 'compactMode', label: 'Компактный режим', desc: 'Уменьшить отступы для большей плотности' },
      ],
    },
    {
      title: 'Данные',
      icon: 'HardDrive',
      color: 'var(--neon-green)',
      items: [
        { key: 'autoDownload', label: 'Авто-загрузка медиа', desc: 'Автоматически загружать фото и видео' },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold gradient-text font-display">Настройки</h2>
      </div>

      <div className="px-4 space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="animate-fade-up">
            <div className="flex items-center gap-2 mb-2 px-1">
              <Icon name={section.icon} size={14} style={{ color: section.color }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: section.color }}>
                {section.title}
              </p>
            </div>
            <div className="glass-light rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i < section.items.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 font-medium">{item.label}</p>
                    <p className="text-xs text-white/30 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                  <Toggle
                    value={settings[item.key as keyof typeof settings]}
                    onChange={() => toggle(item.key as keyof typeof settings)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="glass-light rounded-2xl overflow-hidden animate-fade-up">
          {[
            { icon: 'HelpCircle', label: 'Помощь и поддержка', color: 'var(--neon-purple)' },
            { icon: 'Info', label: 'О приложении', color: 'var(--neon-cyan)' },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <Icon name={item.icon} size={16} style={{ color: item.color }} />
              <span className="text-sm text-white/70">{item.label}</span>
              <Icon name="ChevronRight" size={14} className="ml-auto text-white/20" />
            </button>
          ))}
        </div>

        <button
          className="w-full py-3 rounded-2xl text-sm font-semibold transition-all"
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
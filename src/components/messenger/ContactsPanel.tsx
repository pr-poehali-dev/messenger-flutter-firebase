import { contacts } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const ContactsPanel = () => {
  const online = contacts.filter((c) => c.online);
  const offline = contacts.filter((c) => !c.online);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold gradient-text font-display">Контакты</h2>
        <p className="text-xs text-white/30 mt-0.5">{contacts.length} контактов</p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 py-2">
          В сети — {online.length}
        </p>
        {online.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group animate-fade-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <Avatar label={c.avatar} color={c.color} size="md" online={c.online} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white/90 truncate">{c.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--neon-green)' }}>{c.status}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70">
                <Icon name="MessageCircle" size={15} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70">
                <Icon name="Phone" size={15} />
              </button>
            </div>
          </div>
        ))}

        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 py-2 mt-2">
          Не в сети — {offline.length}
        </p>
        {offline.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group animate-fade-up"
            style={{ animationDelay: `${(online.length + i) * 40}ms` }}
          >
            <Avatar label={c.avatar} color={c.color} size="md" online={c.online} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white/70 truncate">{c.name}</p>
              <p className="text-xs text-white/30 truncate">{c.status}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70">
                <Icon name="MessageCircle" size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsPanel;

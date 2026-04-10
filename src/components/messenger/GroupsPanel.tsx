import { chats } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const groups = chats.filter((c) => c.isGroup);

const GroupsPanel = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold gradient-text font-display">Группы</h2>
          <p className="text-xs text-white/30 mt-0.5">{groups.length} группы</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 15px rgba(168,85,247,0.3)' }}
        >
          <Icon name="Plus" size={14} />
          Создать
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {groups.map((g, i) => (
          <div
            key={g.id}
            className="p-4 mx-2 my-2 rounded-2xl glass-light hover:bg-white/5 transition-all cursor-pointer animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: `linear-gradient(135deg, ${g.color}44, ${g.color}22)`, border: `1px solid ${g.color}44` }}
              >
                {g.avatar}
              </div>
              <div>
                <p className="font-bold text-white/90">{g.name}</p>
                <p className="text-xs text-white/30">3 участника</p>
              </div>
            </div>
            <p className="text-xs text-white/40 truncate">{g.lastMessage}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex -space-x-2">
                {['#a855f7', '#22d3ee', '#f472b6'].map((c) => (
                  <div
                    key={c}
                    className="w-6 h-6 rounded-full border-2 border-[var(--bg-deep)]"
                    style={{ background: c }}
                  />
                ))}
              </div>
              {g.unread > 0 && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: g.color }}
                >
                  {g.unread}
                </span>
              )}
            </div>
          </div>
        ))}

        <div
          className="mx-2 my-2 p-4 rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-500/40 transition-all cursor-pointer flex items-center justify-center gap-2 text-white/30 hover:text-purple-400 animate-fade-up"
          style={{ animationDelay: `${groups.length * 80}ms` }}
        >
          <Icon name="Plus" size={18} />
          <span className="text-sm">Создать новую группу</span>
        </div>
      </div>
    </div>
  );
};

export default GroupsPanel;

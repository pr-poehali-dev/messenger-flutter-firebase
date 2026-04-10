import { useState } from 'react';
import { chats, contacts } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

const SearchPanel = () => {
  const [query, setQuery] = useState('');

  const all = [
    ...chats.map((c) => ({ ...c, type: 'chat' as const })),
    ...contacts.map((c) => ({ ...c, type: 'contact' as const, lastMessage: c.status, time: '', unread: 0, isGroup: false, messages: [] })),
  ];

  const results = query.trim()
    ? all.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3">
        <h2 className="text-lg font-bold gradient-text font-display mb-3">Поиск</h2>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск чатов и контактов..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-white/90 placeholder-white/25 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              <Icon name="X" size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {!query && (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(34,211,238,0.2))' }}
            >
              <Icon name="Search" size={28} className="text-purple-400" />
            </div>
            <p className="text-sm text-white/40">Введите имя или текст для поиска</p>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <Icon name="SearchX" size={40} className="text-white/20 mb-3" />
            <p className="text-sm text-white/40">Ничего не найдено по запросу «{query}»</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 py-2">
              Результаты — {results.length}
            </p>
            {results.map((item, i) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <Avatar label={item.avatar} color={item.color} size="md" online={item.online} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white/90 truncate">{item.name}</p>
                  <p className="text-xs text-white/40 truncate">{item.lastMessage}</p>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: item.type === 'chat' ? 'rgba(168,85,247,0.2)' : 'rgba(34,211,238,0.2)',
                    color: item.type === 'chat' ? 'var(--neon-purple)' : 'var(--neon-cyan)',
                  }}
                >
                  {item.type === 'chat' ? 'Чат' : 'Контакт'}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;

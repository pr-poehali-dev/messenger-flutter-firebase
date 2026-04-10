import { Chat } from '@/data/mockData';
import Avatar from './Avatar';
import Icon from '@/components/ui/icon';

interface ChatListProps {
  chats: Chat[];
  selectedId: string | null;
  onSelect: (chat: Chat) => void;
}

const ChatList = ({ chats, selectedId, onSelect }: ChatListProps) => {
  return (
    <div className="flex flex-col gap-1 p-2">
      {chats.map((chat, i) => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat)}
          className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 hover:bg-white/5 group animate-fade-up ${
            selectedId === chat.id ? 'glass neon-border-purple' : ''
          }`}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <Avatar label={chat.avatar} color={chat.color} size="md" online={chat.online} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-sm truncate text-white/90">
                {chat.name}
                {chat.isGroup && (
                  <Icon name="Users" size={12} className="inline ml-1 text-white/40" />
                )}
              </span>
              <span className="text-xs text-white/30 flex-shrink-0">{chat.time}</span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              {chat.typing ? (
                <span className="text-xs truncate" style={{ color: 'var(--neon-purple)' }}>
                  печатает...
                </span>
              ) : (
                <span className="text-xs text-white/40 truncate">{chat.lastMessage}</span>
              )}
              {chat.unread > 0 && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 min-w-[20px] text-center"
                  style={{ background: 'var(--neon-purple)', color: '#fff' }}
                >
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChatList;

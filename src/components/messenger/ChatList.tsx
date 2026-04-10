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
    <div className="flex flex-col px-2 py-1">
      {chats.map((chat, i) => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat)}
          className={`chat-item w-full flex items-center gap-3 px-3 py-2.5 text-left animate-fade-up ${
            selectedId === chat.id ? 'active' : ''
          }`}
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <Avatar label={chat.avatar} color={chat.color} size="md" online={chat.online} />

          <div className="flex-1 min-w-0">
            {/* Row 1: name + time */}
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span
                className="font-semibold text-sm truncate leading-snug"
                style={{ color: 'var(--text-primary)' }}
              >
                {chat.name}
                {chat.isGroup && (
                  <Icon name="Users" size={11} className="inline ml-1 opacity-40" />
                )}
              </span>
              <span className="text-[11px] flex-shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                {chat.time}
              </span>
            </div>

            {/* Row 2: last message + badge */}
            <div className="flex items-center justify-between gap-1">
              {chat.typing ? (
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--tg-blue)' }}>
                  <span className="inline-flex gap-0.5 items-end h-3">
                    <span className="typing-dot w-1 h-1 rounded-full bg-current inline-block" />
                    <span className="typing-dot w-1 h-1 rounded-full bg-current inline-block" />
                    <span className="typing-dot w-1 h-1 rounded-full bg-current inline-block" />
                  </span>
                  печатает
                </span>
              ) : (
                <span
                  className="text-[13px] truncate leading-snug"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {chat.lastMessage}
                </span>
              )}
              {chat.unread > 0 && (
                <span className="unread-badge flex-shrink-0 animate-bounce-in">
                  {chat.unread > 99 ? '99+' : chat.unread}
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

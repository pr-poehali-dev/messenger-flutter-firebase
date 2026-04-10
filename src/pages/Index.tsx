import { useState } from 'react';
import { chats, Chat } from '@/data/mockData';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import ContactsPanel from '@/components/messenger/ContactsPanel';
import GroupsPanel from '@/components/messenger/GroupsPanel';
import SearchPanel from '@/components/messenger/SearchPanel';
import ProfilePanel from '@/components/messenger/ProfilePanel';
import SettingsPanel from '@/components/messenger/SettingsPanel';
import Icon from '@/components/ui/icon';

type Tab = 'chats' | 'contacts' | 'groups' | 'search' | 'profile' | 'settings';

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'groups', icon: 'LayoutGrid', label: 'Группы' },
  { id: 'search', icon: 'Search', label: 'Поиск' },
  { id: 'profile', icon: 'User', label: 'Профиль' },
  { id: 'settings', icon: 'Settings', label: 'Настройки' },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);

  const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="h-screen flex overflow-hidden mesh-bg">
      {/* Sidebar Navigation */}
      <div
        className="w-16 flex flex-col items-center py-4 gap-1 flex-shrink-0 z-10"
        style={{ background: 'var(--bg-card)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Logo */}
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3 animate-pulse-glow"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #22d3ee)' }}
        >
          <Icon name="Zap" size={20} className="text-white" />
        </div>

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className="relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 group"
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.3))' : 'transparent',
                boxShadow: isActive ? '0 0 20px rgba(168,85,247,0.25)' : 'none',
              }}
            >
              <Icon
                name={tab.icon}
                size={20}
                style={{ color: isActive ? 'var(--neon-purple)' : 'rgba(255,255,255,0.3)' }}
              />
              {tab.id === 'chats' && totalUnread > 0 && (
                <span
                  className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                  style={{ background: 'var(--neon-purple)' }}
                >
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
              {/* Tooltip */}
              <span className="absolute left-14 bg-[var(--bg-elevated)] text-white/80 text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/10">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Left Panel */}
      <div
        className="w-72 flex flex-col flex-shrink-0"
        style={{ background: 'var(--bg-card)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {activeTab === 'chats' && (
          <>
            <div className="px-4 pt-4 pb-3 flex items-center justify-between flex-shrink-0">
              <h1 className="text-lg font-bold gradient-text font-display">Сообщения</h1>
              <button
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-purple-400 hover:bg-white/5 transition-all"
              >
                <Icon name="Edit" size={16} />
              </button>
            </div>
            <div className="px-4 pb-3 flex-shrink-0">
              <div className="relative">
                <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  placeholder="Поиск..."
                  className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-3 py-2 text-xs text-white/70 placeholder-white/25 focus:outline-none focus:border-purple-500/40 transition-colors"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ChatList chats={chats} selectedId={selectedChat?.id ?? null} onSelect={setSelectedChat} />
            </div>
          </>
        )}
        {activeTab === 'contacts' && <ContactsPanel />}
        {activeTab === 'groups' && <GroupsPanel />}
        {activeTab === 'search' && <SearchPanel />}
        {activeTab === 'profile' && <ProfilePanel />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} key={selectedChat.id} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(34,211,238,0.2))' }}
            >
              <Icon name="MessageCircle" size={36} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text font-display mb-2">Выберите чат</h2>
              <p className="text-sm text-white/30">Выберите беседу слева чтобы начать общение</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

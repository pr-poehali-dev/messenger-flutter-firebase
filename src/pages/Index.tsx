import { useState, useEffect } from 'react';
import { chats, Chat } from '@/data/mockData';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import ContactsPanel from '@/components/messenger/ContactsPanel';
import GroupsPanel from '@/components/messenger/GroupsPanel';
import SearchPanel from '@/components/messenger/SearchPanel';
import ProfilePanel from '@/components/messenger/ProfilePanel';
import SettingsPanel from '@/components/messenger/SettingsPanel';
import IncomingCall from '@/components/messenger/IncomingCall';
import Icon from '@/components/ui/icon';

type Tab = 'chats' | 'contacts' | 'groups' | 'search' | 'profile' | 'settings';

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: 'chats',    icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts', icon: 'Users',         label: 'Контакты' },
  { id: 'groups',   icon: 'LayoutGrid',    label: 'Группы' },
  { id: 'search',   icon: 'Search',        label: 'Поиск' },
  { id: 'profile',  icon: 'User',          label: 'Профиль' },
  { id: 'settings', icon: 'Settings',      label: 'Настройки' },
];

const incomingCallScenarios = [
  { chatIndex: 2, isVideo: false, delay: 8000 },
  { chatIndex: 5, isVideo: true,  delay: 35000 },
];

const Index = () => {
  const [activeTab, setActiveTab]   = useState<Tab>('chats');
  const [panelKey, setPanelKey]     = useState(0);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [darkMode, setDarkMode]     = useState(false);
  const [incomingCall, setIncomingCall] = useState<{
    name: string; avatar: string; color: string; isVideo: boolean;
  } | null>(null);

  const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Simulate incoming calls
  useEffect(() => {
    const timers = incomingCallScenarios.map(({ chatIndex, isVideo, delay }) =>
      setTimeout(() => {
        const caller = chats[chatIndex];
        setIncomingCall({ name: caller.name, avatar: caller.avatar, color: caller.color, isVideo });
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setPanelKey((k) => k + 1);
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--surface-1)' }}>

      {/* ── Sidebar ── */}
      <div
        className="w-[62px] flex flex-col items-center py-3 gap-0.5 flex-shrink-0 z-10"
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          boxShadow: '1px 0 0 var(--sidebar-border)',
        }}
      >
        {/* Logo */}
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2 animate-pulse-glow cursor-pointer"
          style={{ background: 'var(--tg-blue)' }}
        >
          <Icon name="Zap" size={20} className="text-white" />
        </div>

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              title={tab.label}
              className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 group"
              style={{
                background: isActive ? 'var(--sidebar-active)' : 'transparent',
                color: isActive ? 'var(--tg-blue)' : 'var(--text-tertiary)',
              }}
            >
              <Icon name={tab.icon} size={20} />
              {tab.id === 'chats' && totalUnread > 0 && (
                <span className="unread-badge absolute top-1 right-1 animate-bounce-in" style={{ minWidth: 16, height: 16, fontSize: 9 }}>
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
              {/* Tooltip */}
              <span
                className="absolute left-[52px] px-2 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none z-50 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'var(--surface-0)',
                  color: 'var(--text-primary)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  border: '1px solid var(--sidebar-border)',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Dark mode toggle at bottom */}
        <div className="flex-1" />
        <button
          onClick={() => setDarkMode((d) => !d)}
          title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
          className="theme-toggle w-11 h-11 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--sidebar-hover)]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <Icon name={darkMode ? 'Sun' : 'Moon'} size={18} />
        </button>
      </div>

      {/* ── Left panel ── */}
      <div
        className="w-[300px] flex flex-col flex-shrink-0"
        style={{
          background: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        <div key={panelKey} className="flex flex-col h-full panel-enter">
          {activeTab === 'chats' && (
            <>
              {/* Panel header */}
              <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
                <h1 className="text-[17px] font-bold" style={{ color: 'var(--text-primary)' }}>Сообщения</h1>
                <button
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-[var(--sidebar-hover)]"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <Icon name="Edit" size={16} />
                </button>
              </div>
              {/* Search */}
              <div className="px-3 pb-2 flex-shrink-0">
                <div className="relative">
                  <Icon
                    name="Search" size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'var(--text-tertiary)' }}
                  />
                  <input
                    placeholder="Поиск"
                    className="w-full rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none transition-colors"
                    style={{
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      border: '1.5px solid transparent',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--tg-blue)')}
                    onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ChatList chats={chats} selectedId={selectedChat?.id ?? null} onSelect={setSelectedChat} />
              </div>
            </>
          )}
          {activeTab === 'contacts' && <ContactsPanel />}
          {activeTab === 'groups'   && <GroupsPanel />}
          {activeTab === 'search'   && <SearchPanel />}
          {activeTab === 'profile'  && <ProfilePanel />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} key={selectedChat.id} />
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8"
            style={{ background: 'var(--surface-1)' }}
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center animate-pulse-glow"
              style={{ background: 'var(--tg-blue)', opacity: 0.85 }}
            >
              <Icon name="MessageCircle" size={36} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Выберите чат</h2>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Выберите беседу слева чтобы начать общение</p>
            </div>
          </div>
        )}
      </div>

      {/* Incoming call */}
      {incomingCall && (
        <IncomingCall
          name={incomingCall.name}
          avatar={incomingCall.avatar}
          color={incomingCall.color}
          isVideo={incomingCall.isVideo}
          onAccept={() => setIncomingCall(null)}
          onDecline={() => setIncomingCall(null)}
        />
      )}
    </div>
  );
};

export default Index;

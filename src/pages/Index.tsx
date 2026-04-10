import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "chats" | "groups" | "contacts" | "search" | "profile" | "settings";

interface Message {
  id: number;
  text: string;
  out: boolean;
  time: string;
  read?: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  typing?: boolean;
  color: string;
  messages: Message[];
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  phone: string;
  online: boolean;
  color: string;
  status: string;
}

interface Group {
  id: number;
  name: string;
  avatar: string;
  members: number;
  lastMsg: string;
  time: string;
  unread: number;
  color: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CHATS: Chat[] = [
  {
    id: 1, name: "Алиса Новикова", avatar: "АН", color: "#a855f7",
    lastMsg: "Окей, договорились!", time: "14:32", unread: 3, online: true, typing: true,
    messages: [
      { id: 1, text: "Привет! Как дела?", out: false, time: "14:20", read: true },
      { id: 2, text: "Всё отлично, спасибо! А у тебя?", out: true, time: "14:21", read: true },
      { id: 3, text: "Тоже хорошо 😊 Встретимся сегодня вечером?", out: false, time: "14:25", read: true },
      { id: 4, text: "Да, давай в 19:00 у кафе на Арбате", out: true, time: "14:28", read: true },
      { id: 5, text: "Окей, договорились!", out: false, time: "14:32", read: false },
    ]
  },
  {
    id: 2, name: "Макс Соколов", avatar: "МС", color: "#22d3ee",
    lastMsg: "Отправил файлы на почту", time: "13:15", unread: 0, online: false, typing: false,
    messages: [
      { id: 1, text: "Макс, привет! Нужны те документы", out: true, time: "12:50", read: true },
      { id: 2, text: "Щас найду и пришлю", out: false, time: "12:55", read: true },
      { id: 3, text: "Отправил файлы на почту", out: false, time: "13:15", read: true },
    ]
  },
  {
    id: 3, name: "Даша Крылова", avatar: "ДК", color: "#f472b6",
    lastMsg: "Посмотри фото!", time: "12:00", unread: 7, online: true, typing: false,
    messages: [
      { id: 1, text: "Даш, привет!", out: true, time: "11:50", read: true },
      { id: 2, text: "Привет! Посмотри фото!", out: false, time: "12:00", read: false },
    ]
  },
  {
    id: 4, name: "Иван Петров", avatar: "ИП", color: "#fb923c",
    lastMsg: "Увидимся на конференции", time: "Вчера", unread: 0, online: false, typing: false,
    messages: [
      { id: 1, text: "Привет, ты будешь на конфе?", out: false, time: "Вчера", read: true },
      { id: 2, text: "Да, обязательно", out: true, time: "Вчера", read: true },
      { id: 3, text: "Увидимся на конференции", out: false, time: "Вчера", read: true },
    ]
  },
  {
    id: 5, name: "Саша Белова", avatar: "СБ", color: "#4ade80",
    lastMsg: "Спасибо за помощь!", time: "Вчера", unread: 1, online: true, typing: false,
    messages: [
      { id: 1, text: "Спасибо за помощь!", out: false, time: "Вчера", read: false },
    ]
  },
];

const CONTACTS: Contact[] = [
  { id: 1, name: "Алиса Новикова", avatar: "АН", phone: "+7 900 123-45-67", online: true, color: "#a855f7", status: "На связи" },
  { id: 2, name: "Макс Соколов", avatar: "МС", phone: "+7 901 234-56-78", online: false, color: "#22d3ee", status: "Был час назад" },
  { id: 3, name: "Даша Крылова", avatar: "ДК", phone: "+7 902 345-67-89", online: true, color: "#f472b6", status: "Смотрит сериал 🍿" },
  { id: 4, name: "Иван Петров", avatar: "ИП", phone: "+7 903 456-78-90", online: false, color: "#fb923c", status: "Был вчера" },
  { id: 5, name: "Саша Белова", avatar: "СБ", phone: "+7 904 567-89-01", online: true, color: "#4ade80", status: "Работает 💼" },
  { id: 6, name: "Кирилл Зайцев", avatar: "КЗ", phone: "+7 905 678-90-12", online: false, color: "#60a5fa", status: "Недоступен" },
];

const GROUPS: Group[] = [
  { id: 1, name: "Команда разработки", avatar: "КР", members: 12, lastMsg: "Деплой прошёл успешно!", time: "15:00", unread: 5, color: "#a855f7" },
  { id: 2, name: "Друзья 🎉", avatar: "ДР", members: 8, lastMsg: "Кто идёт в пятницу?", time: "14:00", unread: 23, color: "#f472b6" },
  { id: 3, name: "Проект Альфа", avatar: "ПА", members: 5, lastMsg: "Задача закрыта", time: "12:30", unread: 0, color: "#22d3ee" },
  { id: 4, name: "Семья ❤️", avatar: "СМ", members: 6, lastMsg: "Мама: Ждём в воскресенье!", time: "Вчера", unread: 2, color: "#4ade80" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ label, color, size = 40, online = false, ring = false }: { label: string; color: string; size?: number; online?: boolean; ring?: boolean }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div
        className={`flex items-center justify-center rounded-full font-display font-bold text-white transition-all duration-200 ${ring ? "avatar-ring" : ""}`}
        style={{
          width: size, height: size,
          background: `linear-gradient(135deg, ${color}cc, ${color}66)`,
          border: ring ? `2px solid ${color}` : "none",
          fontSize: size * 0.35,
          boxShadow: ring ? `0 0 0 2px ${color}, 0 0 15px ${color}66` : `0 2px 12px ${color}44`,
        }}
      >
        {label}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2"
          style={{
            width: size * 0.28, height: size * 0.28,
            background: "#4ade80",
            borderColor: "var(--bg-deep)",
            boxShadow: "0 0 8px #4ade80",
          }}
        />
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="msg-in rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="typing-dot block rounded-full"
            style={{ width: 6, height: 6, background: "var(--neon-cyan)", animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function ChatView({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [isTyping, setIsTyping] = useState(chat.typing);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages(chat.messages);
    setIsTyping(chat.typing);
  }, [chat]);

  function sendMessage() {
    if (!inputVal.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      text: inputVal.trim(),
      out: true,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setInputVal("");
    // simulate reply typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = ["Понял, спасибо!", "Отлично!", "Ок, договорились 👍", "Сейчас посмотрю", "Хорошо!"];
      const reply: Message = {
        id: messages.length + 2,
        text: replies[Math.floor(Math.random() * replies.length)],
        out: false,
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(168,85,247,0.15)" }}>
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/5 transition-colors text-purple-400 mr-1">
          <Icon name="ChevronLeft" size={22} />
        </button>
        <Avatar label={chat.avatar} color={chat.color} size={40} online={chat.online} />
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-white text-[15px] leading-tight">{chat.name}</p>
          <p className="text-xs mt-0.5" style={{ color: isTyping ? "var(--neon-cyan)" : chat.online ? "#4ade80" : "rgba(255,255,255,0.35)" }}>
            {isTyping ? "печатает..." : chat.online ? "в сети" : "был(а) недавно"}
          </p>
        </div>
        <button className="p-2 rounded-xl hover:bg-white/5 transition-colors text-purple-400">
          <Icon name="Phone" size={20} />
        </button>
        <button className="p-2 rounded-xl hover:bg-white/5 transition-colors text-purple-400">
          <Icon name="Video" size={20} />
        </button>
        <button className="p-2 rounded-xl hover:bg-white/5 transition-colors text-purple-400">
          <Icon name="MoreVertical" size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 mesh-bg">
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex ${msg.out ? "justify-end" : "justify-start"} animate-msg`} style={{ animationDelay: `${idx * 0.03}s` }}>
            <div
              className={`max-w-[72%] px-4 py-2.5 rounded-2xl ${msg.out ? "msg-out rounded-br-sm text-white" : "msg-in rounded-bl-sm"}`}
              style={{ color: msg.out ? "#fff" : "rgba(255,255,255,0.88)" }}
            >
              <p className="text-[14.5px] leading-relaxed">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.out ? "justify-end" : "justify-start"}`}>
                <span className="text-[10px]" style={{ opacity: 0.5 }}>{msg.time}</span>
                {msg.out && (
                  <Icon name={msg.read ? "CheckCheck" : "Check"} size={12} style={{ color: msg.read ? "var(--neon-cyan)" : "rgba(255,255,255,0.4)" }} />
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="glass flex items-center gap-2 px-3 py-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(168,85,247,0.15)" }}>
        <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex-shrink-0" style={{ color: "var(--neon-purple)" }}>
          <Icon name="Paperclip" size={20} />
        </button>
        <div className="flex-1 relative">
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Написать сообщение..."
            className="w-full rounded-2xl px-4 py-2.5 text-[14px] outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(168,85,247,0.2)",
              color: "rgba(255,255,255,0.9)",
              caretColor: "var(--neon-purple)",
            }}
          />
        </div>
        <button className="p-2.5 rounded-xl hover:bg-white/5 transition-colors flex-shrink-0" style={{ color: "var(--neon-purple)" }}>
          <Icon name="Smile" size={20} />
        </button>
        <button
          onClick={sendMessage}
          className="p-2.5 rounded-xl transition-all flex-shrink-0 animate-pulse-glow"
          style={{
            background: inputVal.trim() ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.05)",
            color: inputVal.trim() ? "#fff" : "rgba(255,255,255,0.25)",
          }}
        >
          <Icon name="Send" size={20} />
        </button>
      </div>
    </div>
  );
}

// ─── Tab Screens ───────────────────────────────────────────────────────────────

function ChatsTab({ onOpenChat }: { onOpenChat: (chat: Chat) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <h1 className="font-display text-2xl font-bold gradient-text">Сообщения</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          {CHATS.filter(c => c.unread > 0).length} непрочитанных
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {CHATS.map((chat, idx) => (
          <button
            key={chat.id}
            onClick={() => onOpenChat(chat)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all hover:scale-[1.01] text-left animate-fade-in"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              animationDelay: `${idx * 0.05}s`,
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <Avatar label={chat.avatar} color={chat.color} size={48} online={chat.online} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white text-[14.5px] leading-tight truncate">{chat.name}</p>
                <span className="text-[11px] flex-shrink-0 ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>{chat.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-[13px] truncate" style={{ color: chat.typing ? "var(--neon-cyan)" : "rgba(255,255,255,0.4)" }}>
                  {chat.typing ? "печатает..." : chat.lastMsg}
                </p>
                {chat.unread > 0 && (
                  <span
                    className="ml-2 flex-shrink-0 rounded-full text-white text-[11px] font-bold flex items-center justify-center animate-bounce-in"
                    style={{ background: "var(--neon-purple)", minWidth: 20, height: 20, padding: "0 5px" }}
                  >
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function GroupsTab() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <h1 className="font-display text-2xl font-bold gradient-text">Группы</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{GROUPS.length} группы</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
        {GROUPS.map((group, idx) => (
          <button
            key={group.id}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all hover:scale-[1.01] text-left animate-fade-in"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              animationDelay: `${idx * 0.05}s`,
              opacity: 0,
              animationFillMode: "forwards",
            }}
          >
            <div
              className="flex items-center justify-center rounded-2xl font-display font-bold text-white flex-shrink-0"
              style={{
                width: 48, height: 48,
                background: `linear-gradient(135deg, ${group.color}99, ${group.color}44)`,
                border: `1px solid ${group.color}55`,
                fontSize: 15,
                boxShadow: `0 4px 16px ${group.color}33`,
              }}
            >
              <Icon name="Users" size={22} style={{ color: group.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white text-[14.5px] truncate">{group.name}</p>
                <span className="text-[11px] flex-shrink-0 ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>{group.time}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-[13px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{group.lastMsg}</p>
                {group.unread > 0 && (
                  <span
                    className="ml-2 flex-shrink-0 rounded-full text-white text-[11px] font-bold flex items-center justify-center"
                    style={{ background: group.color, minWidth: 20, height: 20, padding: "0 5px" }}
                  >
                    {group.unread > 99 ? "99+" : group.unread}
                  </span>
                )}
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{group.members} участников</p>
            </div>
          </button>
        ))}

        {/* Create group button */}
        <button
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all hover:scale-[1.01]"
          style={{ border: "1px dashed rgba(168,85,247,0.3)", color: "var(--neon-purple)" }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)" }}>
            <Icon name="Plus" size={22} />
          </div>
          <span className="font-medium text-[14px]">Создать группу</span>
        </button>
      </div>
    </div>
  );
}

function ContactsTab() {
  const letters = [...new Set(CONTACTS.map(c => c.name[0]))].sort();
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <h1 className="font-display text-2xl font-bold gradient-text">Контакты</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{CONTACTS.length} контактов</p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {letters.map(letter => (
          <div key={letter}>
            <p className="text-xs font-bold px-1 py-2" style={{ color: "var(--neon-purple)" }}>{letter}</p>
            {CONTACTS.filter(c => c.name[0] === letter).map((contact, idx) => (
              <button
                key={contact.id}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all hover:scale-[1.01] text-left mb-1 animate-fade-in"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  animationDelay: `${idx * 0.05}s`,
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                <Avatar label={contact.avatar} color={contact.color} size={46} online={contact.online} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-[14.5px]">{contact.name}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: contact.online ? "#4ade80" : "rgba(255,255,255,0.35)" }}>
                    {contact.status}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 rounded-xl hover:bg-white/5 transition-colors" style={{ color: "var(--neon-purple)" }}>
                    <Icon name="MessageCircle" size={18} />
                  </button>
                  <button className="p-2 rounded-xl hover:bg-white/5 transition-colors" style={{ color: "var(--neon-cyan)" }}>
                    <Icon name="Phone" size={18} />
                  </button>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchTab() {
  const [query, setQuery] = useState("");
  const allItems = [
    ...CHATS.map(c => ({ ...c, type: "chat" as const })),
    ...CONTACTS.map(c => ({ ...c, type: "contact" as const, lastMsg: c.status, time: "", unread: 0 })),
    ...GROUPS.map(g => ({ ...g, type: "group" as const, online: false })),
  ];
  const filtered = query.trim()
    ? allItems.filter(i => i.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <h1 className="font-display text-2xl font-bold gradient-text mb-3">Поиск</h1>
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Имя, сообщение, группа..."
            autoFocus
            className="w-full rounded-2xl pl-10 pr-4 py-3 text-[14px] outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(168,85,247,0.25)",
              color: "rgba(255,255,255,0.9)",
              caretColor: "var(--neon-purple)",
            }}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {!query && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.1)" }}>
              <Icon name="Search" size={28} style={{ color: "var(--neon-purple)" }} />
            </div>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Введите запрос для поиска</p>
          </div>
        )}
        {query && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Icon name="SearchX" size={32} style={{ color: "rgba(255,255,255,0.2)" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Ничего не найдено</p>
          </div>
        )}
        {filtered.map((item, idx) => (
          <button
            key={`${item.type}-${item.id}`}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all hover:scale-[1.01] text-left mb-1 animate-fade-in"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", animationDelay: `${idx * 0.04}s`, opacity: 0, animationFillMode: "forwards" }}
          >
            <Avatar label={item.avatar} color={item.color} size={44} online={"online" in item ? item.online : false} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-[14px]">{item.name}</p>
              <p className="text-[12px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                {"type" in item && item.type === "group" ? `${(item as Group).members} участников` : item.lastMsg}
              </p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-lg" style={{ background: "rgba(168,85,247,0.15)", color: "var(--neon-purple)" }}>
              {item.type === "chat" ? "Чат" : item.type === "contact" ? "Контакт" : "Группа"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Hero */}
      <div className="relative px-4 pt-10 pb-6 flex flex-col items-center mesh-bg">
        <div className="relative mb-4">
          <Avatar label="ЮВ" color="#a855f7" size={90} ring />
          <button
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 12px rgba(168,85,247,0.6)" }}
          >
            <Icon name="Camera" size={13} style={{ color: "#fff" }} />
          </button>
        </div>
        <h2 className="font-display text-xl font-bold text-white">Юрий Воронов</h2>
        <p className="text-sm mt-1" style={{ color: "var(--neon-cyan)" }}>+7 900 000-00-00</p>
        <p className="text-xs mt-1 text-center max-w-[200px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Разработчик · Путешественник ✈️
        </p>
        {/* Stats */}
        <div className="flex gap-6 mt-5">
          {[
            { label: "Чатов", value: CHATS.length },
            { label: "Групп", value: GROUPS.length },
            { label: "Контактов", value: CONTACTS.length },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="font-display font-bold text-xl gradient-text">{stat.value}</span>
              <span className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div className="px-4 py-4 space-y-2">
        {[
          { icon: "User", label: "Имя пользователя", value: "@yuravofonov", color: "#a855f7" },
          { icon: "Phone", label: "Телефон", value: "+7 900 000-00-00", color: "#22d3ee" },
          { icon: "Mail", label: "Email", value: "yura@example.com", color: "#f472b6" },
          { icon: "MapPin", label: "Город", value: "Москва, Россия", color: "#fb923c" },
        ].map(item => (
          <div
            key={item.icon}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${item.color}22` }}>
              <Icon name={item.icon} fallback="Circle" size={18} style={{ color: item.color }} />
            </div>
            <div>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{item.label}</p>
              <p className="text-[14px] font-medium text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const sections = [
    {
      title: "Уведомления",
      items: [
        { icon: "Bell", label: "Push-уведомления", color: "#a855f7", toggle: true, value: notifications, onChange: setNotifications },
        { icon: "Volume2", label: "Звуки сообщений", color: "#22d3ee", toggle: true, value: sounds, onChange: setSounds },
      ]
    },
    {
      title: "Внешний вид",
      items: [
        { icon: "Moon", label: "Тёмная тема", color: "#f472b6", toggle: true, value: darkMode, onChange: setDarkMode },
        { icon: "Palette", label: "Акцентный цвет", color: "#fb923c", toggle: false, value: false, onChange: () => {} },
      ]
    },
    {
      title: "Безопасность",
      items: [
        { icon: "Shield", label: "Двухфакторная аутентификация", color: "#4ade80", toggle: true, value: twoFactor, onChange: setTwoFactor },
        { icon: "Key", label: "Сменить пароль", color: "#60a5fa", toggle: false, value: false, onChange: () => {} },
      ]
    },
    {
      title: "Аккаунт",
      items: [
        { icon: "Download", label: "Скачать данные", color: "#a855f7", toggle: false, value: false, onChange: () => {} },
        { icon: "LogOut", label: "Выйти из аккаунта", color: "#f87171", toggle: false, value: false, onChange: () => {} },
      ]
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <h1 className="font-display text-2xl font-bold gradient-text">Настройки</h1>
      </div>
      <div className="px-3 pb-6 space-y-4">
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-xs font-bold px-2 pb-2" style={{ color: "rgba(255,255,255,0.35)" }}>{section.title.toUpperCase()}</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {section.items.map((item, idx) => (
                <div
                  key={item.icon}
                  className={`flex items-center gap-3 px-4 py-3.5 ${idx < section.items.length - 1 ? "border-b" : ""}`}
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${item.color}22` }}>
                    <Icon name={item.icon} fallback="Circle" size={18} style={{ color: item.color }} />
                  </div>
                  <span className="flex-1 text-[14px] font-medium text-white">{item.label}</span>
                  {item.toggle ? (
                    <button
                      onClick={() => item.onChange(!item.value)}
                      className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
                      style={{ background: item.value ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "rgba(255,255,255,0.1)" }}
                    >
                      <span
                        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                        style={{ left: item.value ? "calc(100% - 22px)" : "2px", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
                      />
                    </button>
                  ) : (
                    <Icon name="ChevronRight" size={16} style={{ color: "rgba(255,255,255,0.2)" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Tab; icon: string; label: string }[] = [
  { id: "chats", icon: "MessageCircle", label: "Чаты" },
  { id: "groups", icon: "Users", label: "Группы" },
  { id: "contacts", icon: "BookUser", label: "Контакты" },
  { id: "search", icon: "Search", label: "Поиск" },
  { id: "profile", icon: "User", label: "Профиль" },
  { id: "settings", icon: "Settings", label: "Настройки" },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>("chats");
  const [openChat, setOpenChat] = useState<Chat | null>(null);
  const prevTab = useRef<Tab>("chats");

  function handleTabChange(t: Tab) {
    prevTab.current = tab;
    setTab(t);
    setOpenChat(null);
  }

  const totalUnread = CHATS.reduce((acc, c) => acc + c.unread, 0) + GROUPS.reduce((acc, g) => acc + g.unread, 0);

  return (
    <div className="mesh-bg flex items-center justify-center min-h-screen" style={{ fontFamily: "'Rubik', sans-serif" }}>
      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: "min(420px, 100vw)",
          height: "min(820px, 100vh)",
          background: "var(--bg-deep)",
          borderRadius: "min(36px, 0px)",
          border: "1px solid rgba(168,85,247,0.2)",
          boxShadow: "0 0 80px rgba(168,85,247,0.2), 0 0 200px rgba(34,211,238,0.08)",
        }}
      >
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-1 flex-shrink-0" style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          <span className="font-medium">9:41</span>
          <div className="font-display font-black text-lg" style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            PULSE
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="Wifi" size={13} />
            <Icon name="Battery" size={13} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Chat View (overlay) */}
          {openChat && (
            <div className="absolute inset-0 z-10 animate-slide-right" style={{ background: "var(--bg-deep)" }}>
              <ChatView chat={openChat} onBack={() => setOpenChat(null)} />
            </div>
          )}

          {/* Tab content */}
          <div className="h-full overflow-hidden" key={tab}>
            {tab === "chats" && <ChatsTab onOpenChat={setOpenChat} />}
            {tab === "groups" && <GroupsTab />}
            {tab === "contacts" && <ContactsTab />}
            {tab === "search" && <SearchTab />}
            {tab === "profile" && <ProfileTab />}
            {tab === "settings" && <SettingsTab />}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div
          className="glass nav-glow flex items-center justify-around px-2 py-2 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(168,85,247,0.15)" }}
        >
          {NAV_ITEMS.map(item => {
            const isActive = tab === item.id;
            const badgeCount = item.id === "chats" ? CHATS.reduce((a, c) => a + c.unread, 0)
              : item.id === "groups" ? GROUPS.reduce((a, g) => a + g.unread, 0) : 0;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className="relative flex flex-col items-center gap-1 px-2 py-1.5 rounded-2xl transition-all"
                style={{
                  color: isActive ? "var(--neon-purple)" : "rgba(255,255,255,0.3)",
                  background: isActive ? "rgba(168,85,247,0.12)" : "transparent",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  minWidth: 48,
                }}
              >
                {isActive && (
                  <span
                    className="absolute -top-1 left-1/2 -translate-x-1/2 rounded-full"
                    style={{ width: 24, height: 2, background: "var(--neon-purple)", boxShadow: "0 0 8px var(--neon-purple)" }}
                  />
                )}
                <Icon name={item.icon} fallback="Circle" size={22} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
                {badgeCount > 0 && (
                  <span
                    className="absolute -top-0.5 right-0.5 rounded-full text-white flex items-center justify-center font-bold"
                    style={{ background: "var(--neon-purple)", minWidth: 16, height: 16, fontSize: 9, padding: "0 3px", boxShadow: "0 0 8px rgba(168,85,247,0.7)" }}
                  >
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
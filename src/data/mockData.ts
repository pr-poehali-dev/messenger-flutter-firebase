export interface Message {
  id: string;
  text: string;
  time: string;
  isOut: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isGroup?: boolean;
  typing?: boolean;
  messages: Message[];
  color: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  color: string;
  phone?: string;
}

export const chats: Chat[] = [
  {
    id: '1',
    name: 'Алиса Петрова',
    avatar: 'АП',
    lastMessage: 'Окей, увидимся завтра!',
    time: '14:32',
    unread: 3,
    online: true,
    typing: true,
    color: '#a855f7',
    messages: [
      { id: 'm1', text: 'Привет! Как дела?', time: '14:20', isOut: false },
      { id: 'm2', text: 'Отлично, спасибо! А у тебя?', time: '14:21', isOut: true, status: 'read' },
      { id: 'm3', text: 'Тоже хорошо 😊 Ты будешь на встрече?', time: '14:25', isOut: false },
      { id: 'm4', text: 'Да, конечно! Во сколько?', time: '14:27', isOut: true, status: 'read' },
      { id: 'm5', text: 'В 15:00 в кафе на Арбате', time: '14:30', isOut: false },
      { id: 'm6', text: 'Окей, увидимся завтра!', time: '14:32', isOut: false },
    ],
  },
  {
    id: '2',
    name: 'Дизайн команда',
    avatar: '🎨',
    lastMessage: 'Максим: Макеты готовы!',
    time: '13:15',
    unread: 12,
    online: false,
    isGroup: true,
    color: '#22d3ee',
    messages: [
      { id: 'm1', text: 'Всем привет! Начинаем спринт', time: '10:00', isOut: false },
      { id: 'm2', text: 'Готов к работе!', time: '10:05', isOut: true, status: 'read' },
      { id: 'm3', text: 'Макеты готовы!', time: '13:15', isOut: false },
    ],
  },
  {
    id: '3',
    name: 'Михаил Соколов',
    avatar: 'МС',
    lastMessage: 'Посмотри документ, пожалуйста',
    time: '12:45',
    unread: 1,
    online: true,
    color: '#f472b6',
    messages: [
      { id: 'm1', text: 'Привет! Есть минутка?', time: '12:40', isOut: false },
      { id: 'm2', text: 'Да, что случилось?', time: '12:42', isOut: true, status: 'read' },
      { id: 'm3', text: 'Посмотри документ, пожалуйста', time: '12:45', isOut: false },
    ],
  },
  {
    id: '4',
    name: 'Разработчики',
    avatar: '💻',
    lastMessage: 'Деплой прошёл успешно',
    time: '11:30',
    unread: 0,
    online: false,
    isGroup: true,
    color: '#4ade80',
    messages: [
      { id: 'm1', text: 'Начинаем деплой', time: '11:00', isOut: false },
      { id: 'm2', text: 'Деплой прошёл успешно', time: '11:30', isOut: false },
    ],
  },
  {
    id: '5',
    name: 'Катя Иванова',
    avatar: 'КИ',
    lastMessage: 'Спасибо за помощь!',
    time: 'вчера',
    unread: 0,
    online: false,
    color: '#fb923c',
    messages: [
      { id: 'm1', text: 'Ты не мог бы помочь с презентацией?', time: '18:00', isOut: false },
      { id: 'm2', text: 'Конечно, давай посмотрю', time: '18:15', isOut: true, status: 'read' },
      { id: 'm3', text: 'Спасибо за помощь!', time: '19:00', isOut: false },
    ],
  },
  {
    id: '6',
    name: 'Андрей Новиков',
    avatar: 'АН',
    lastMessage: 'До встречи!',
    time: 'вчера',
    unread: 0,
    online: true,
    color: '#818cf8',
    messages: [
      { id: 'm1', text: 'Когда будет встреча?', time: '09:00', isOut: false },
      { id: 'm2', text: 'Завтра в 10:00', time: '09:05', isOut: true, status: 'read' },
      { id: 'm3', text: 'До встречи!', time: '09:10', isOut: false },
    ],
  },
];

export const contacts: Contact[] = [
  { id: '1', name: 'Алиса Петрова', avatar: 'АП', status: 'На связи', online: true, color: '#a855f7', phone: '+7 999 123-45-67' },
  { id: '2', name: 'Михаил Соколов', avatar: 'МС', status: 'Занят', online: true, color: '#f472b6', phone: '+7 999 234-56-78' },
  { id: '3', name: 'Андрей Новиков', avatar: 'АН', status: 'В сети', online: true, color: '#818cf8', phone: '+7 999 345-67-89' },
  { id: '4', name: 'Катя Иванова', avatar: 'КИ', status: 'Была час назад', online: false, color: '#fb923c', phone: '+7 999 456-78-90' },
  { id: '5', name: 'Сергей Попов', avatar: 'СП', status: 'Не беспокоить', online: false, color: '#22d3ee', phone: '+7 999 567-89-01' },
  { id: '6', name: 'Наташа Смирнова', avatar: 'НС', status: 'В отпуске', online: false, color: '#4ade80', phone: '+7 999 678-90-12' },
  { id: '7', name: 'Денис Козлов', avatar: 'ДК', status: 'На связи', online: true, color: '#f59e0b', phone: '+7 999 789-01-23' },
];

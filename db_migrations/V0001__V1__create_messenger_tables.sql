CREATE TABLE IF NOT EXISTS t_p13078793_messenger_flutter_fi.users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  photo_url     TEXT,
  password_hash TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'offline',
  last_seen     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p13078793_messenger_flutter_fi.chats (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_group        BOOLEAN NOT NULL DEFAULT FALSE,
  title           TEXT,
  last_message    TEXT,
  last_message_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p13078793_messenger_flutter_fi.chat_participants (
  chat_id   UUID NOT NULL REFERENCES t_p13078793_messenger_flutter_fi.chats(id),
  user_id   UUID NOT NULL REFERENCES t_p13078793_messenger_flutter_fi.users(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE IF NOT EXISTS t_p13078793_messenger_flutter_fi.messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id    UUID NOT NULL REFERENCES t_p13078793_messenger_flutter_fi.chats(id),
  sender_id  UUID NOT NULL REFERENCES t_p13078793_messenger_flutter_fi.users(id),
  text       TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cp_user ON t_p13078793_messenger_flutter_fi.chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_msg_chat ON t_p13078793_messenger_flutter_fi.messages(chat_id, created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON t_p13078793_messenger_flutter_fi.users(email);

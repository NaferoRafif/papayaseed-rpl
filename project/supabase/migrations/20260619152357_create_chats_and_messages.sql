-- Create chats table for customer-admin conversations
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chats
CREATE POLICY "select_own_chats" ON chats FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_chats" ON chats FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_chats" ON chats FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

-- Admin policies for chats
CREATE POLICY "admin_select_chats" ON chats FOR SELECT
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "admin_update_chats" ON chats FOR UPDATE
  TO authenticated USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  ));

-- RLS policies for messages
CREATE POLICY "select_own_messages" ON messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM admins WHERE admins.email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id)
  );

CREATE POLICY "admin_insert_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (sender_type = 'admin' AND EXISTS (
    SELECT 1 FROM admins WHERE admins.email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  ));

-- Index for performance
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_chats_updated_at ON chats(updated_at DESC);
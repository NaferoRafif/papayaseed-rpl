import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface Chat {
  id: string;
  user_id: string;
  user_email?: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_type: 'user' | 'admin';
  sender_id: string | null;
  content: string;
  created_at: string;
}

export interface ChatWithUser extends Chat {
  user_email: string;
  last_message?: string;
  last_message_at?: string;
}

export function useUserChat() {
  const { user } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrCreateChat = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Check for existing open chat
    const { data: existing } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'open')
      .maybeSingle();

    if (existing) {
      setChat(existing as Chat);
    } else {
      // Create new chat
      const { data: newChat, error } = await supabase
        .from('chats')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (!error && newChat) {
        setChat(newChat as Chat);
      }
    }
    setLoading(false);
  }, [user]);

  const fetchMessages = useCallback(async (chatId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (data) setMessages(data as Message[]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!chat || !content.trim()) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chat.id,
        sender_type: 'user',
        sender_id: user?.id,
        content: content.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setMessages((prev) => [...prev, data as Message]);
      // Update chat timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chat.id);
    }
  }, [chat, user]);

  useEffect(() => {
    if (chat) {
      fetchMessages(chat.id);

      // Subscribe to new messages
      const channel = supabase
        .channel(`messages:${chat.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chat_id=eq.${chat.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [chat, fetchMessages]);

  return { chat, messages, loading, fetchOrCreateChat, sendMessage };
}

export function useAdminChats() {
  const [chats, setChats] = useState<ChatWithUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChats = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('chats')
      .select('*')
      .order('updated_at', { ascending: false });

    if (data) {
      // Get last message for each chat
      const chatsWithMessages = await Promise.all(
        (data as ChatWithUser[]).map(async (chat) => {
          const { data: lastMsg } = await supabase
            .from('messages')
            .select('content, created_at')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...chat,
            last_message: (lastMsg as { content: string } | null)?.content,
            last_message_at: (lastMsg as { created_at: string } | null)?.created_at,
          };
        })
      );
      setChats(chatsWithMessages);
    }
    setLoading(false);
  }, []);

  return { chats, loading, fetchChats };
}

export function useAdminMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (data) setMessages(data as Message[]);
    setLoading(false);
  }, [chatId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!chatId || !content.trim()) return;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_type: 'admin',
          content: content.trim(),
        })
        .select()
        .single();

      if (!error && data) {
        setMessages((prev) => [...prev, data as Message]);
        await supabase
          .from('chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', chatId);
      }
    },
    [chatId]
  );

  const closeChat = useCallback(async () => {
    if (!chatId) return;
    await supabase.from('chats').update({ status: 'closed' }).eq('id', chatId);
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      fetchMessages();

      const channel = supabase
        .channel(`admin-messages:${chatId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chat_id=eq.${chatId}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [chatId, fetchMessages]);

  return { messages, loading, sendMessage, closeChat, fetchMessages };
}

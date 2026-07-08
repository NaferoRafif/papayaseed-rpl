import { useEffect, useRef, useState } from 'react';
import { Send, Loader2, X, MessageCircle, CheckCircle } from 'lucide-react';
import { cn } from '../lib/cn';
import { useAdminChats, useAdminMessages, type ChatWithUser } from '../hooks/useChat';
import { formatRelativeTime } from '../lib/datetime';

export function AdminChat() {
  const { chats, loading, fetchChats } = useAdminChats();
  const [selectedChat, setSelectedChat] = useState<ChatWithUser | null>(null);
  const { messages, loading: msgLoading, sendMessage, closeChat, fetchMessages } = useAdminMessages(
    selectedChat?.id || null
  );
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    await sendMessage(input);
    setInput('');
    setSending(false);
  };

  const handleCloseChat = async () => {
    if (!selectedChat) return;
    await closeChat();
    setSelectedChat(null);
    fetchChats();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openChats = chats.filter((c) => c.status === 'open');
  const closedChats = chats.filter((c) => c.status === 'closed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-semibold text-white">Chat Pelanggan</h2>
          <p className="text-sm text-white/50 mt-1">
            {openChats.length} percakapan aktif
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat list */}
        <div className="lg:col-span-1 glass rounded-2xl p-4 space-y-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">
            Aktif ({openChats.length})
          </h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : openChats.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-4">Tidak ada percakapan aktif</p>
          ) : (
            <div className="space-y-2">
              {openChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat);
                    fetchMessages();
                  }}
                  className={cn(
                    'w-full text-left p-3 rounded-xl transition-colors',
                    selectedChat?.id === chat.id
                      ? 'bg-orange-500/20 border border-orange-500/30'
                      : 'bg-white/5 hover:bg-white/10'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{chat.user_email}</p>
                      <p className="text-xs text-white/40 truncate">{chat.last_message || 'Belum ada pesan'}</p>
                    </div>
                    {chat.last_message_at && (
                      <p className="text-[10px] text-white/30 whitespace-nowrap">
                        {formatRelativeTime(chat.last_message_at)}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {closedChats.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider pt-4 border-t border-white/10">
                Selesai ({closedChats.length})
              </h3>
              <div className="space-y-2 opacity-60">
                {closedChats.slice(0, 5).map((chat) => (
                  <div
                    key={chat.id}
                    className="w-full text-left p-3 rounded-xl bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white/70 truncate">{chat.user_email}</p>
                        <p className="text-xs text-white/30 truncate">{chat.last_message || 'Chat selesai'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Chat detail */}
        <div className="lg:col-span-2 glass rounded-2xl flex flex-col h-[600px]">
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{selectedChat.user_email}</p>
                    <p className="text-[10px] text-white/50">
                      Percakapan dimulai {formatRelativeTime(selectedChat.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseChat}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-sm text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  Selesaikan
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/40 text-sm">Belum ada pesan</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex',
                        msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                          msg.sender_type === 'admin'
                            ? 'bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-br-md'
                            : 'bg-white/10 text-white rounded-bl-md'
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ketik balasan..."
                    className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                    disabled={sending}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                      input.trim() && !sending
                        ? 'bg-gradient-to-br from-orange-500 to-orange-700 text-white'
                        : 'bg-white/10 text-white/40'
                    )}
                  >
                    {sending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50">Pilih percakapan dari daftar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

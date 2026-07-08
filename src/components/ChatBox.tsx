import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';
import { useUserChat } from '../hooks/useChat';
import { useAuth } from '../context/AuthContext';

interface ChatBoxProps {
  onOpenAuth: () => void;
}

export function ChatBox({ onOpenAuth }: ChatBoxProps) {
  const { user } = useAuth();
  const { chat, messages, loading, fetchOrCreateChat, sendMessage } = useUserChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && user && !chat) {
      fetchOrCreateChat();
    }
  }, [open, user, chat, fetchOrCreateChat]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => {
          if (!user) {
            onOpenAuth();
            return;
          }
          setOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-glow hover:scale-105 transition-transform duration-300"
        aria-label="Chat dengan Admin"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex h-[480px] w-[360px] max-w-[calc(100vw-48px)] flex-col rounded-2xl glass-dark shadow-glass overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-700">
            <MessageCircle className="h-4 w-4 text-white" />
          </span>
          <div>
            <p className="text-sm font-medium text-white">Chat Admin</p>
            <p className="text-[10px] text-white/50">Kami siap membantu</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/50 text-sm">Mulai percakapan dengan admin</p>
            <p className="text-white/30 text-xs mt-1">Ketik pesan di bawah</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex',
                msg.sender_type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                  msg.sender_type === 'user'
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
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan..."
            className="flex-1 bg-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
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
    </div>
  );
}

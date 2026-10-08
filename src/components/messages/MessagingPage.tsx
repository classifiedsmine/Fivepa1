import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  CheckCircle2,
  FileText,
  Clock,
  ArrowLeft,
  Briefcase,
} from 'lucide-react';
import { Conversation, Message } from '../../types';

interface MessagingPageProps {
  navigate: (path: string) => void;
}

export const MessagingPage: React.FC<MessagingPageProps> = ({ navigate }) => {
  const { currentUser } = useAuth();
  const { error } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/conversations/${currentUser.id}`);
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !selectedConv) {
          setSelectedConv(data.conversations[0]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id);
    }
  }, [selectedConv]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConv) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/conversations/${selectedConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          content: messageInput.trim(),
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        setMessageInput('');
        fetchConversations();
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden h-[750px] flex flex-col md:flex-row">
        {/* Left: Conversation List */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-2">WorkStream Messages</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active conversations yet.
              </div>
            ) : (
              conversations.map((conv) => {
                const other = conv.participants.find((p) => p.id !== currentUser.id) || conv.participants[0];
                const isSelected = selectedConv?.id === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`p-4 cursor-pointer transition flex items-start gap-3 ${
                      isSelected ? 'bg-white border-l-4 border-emerald-600 shadow-xs' : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={other.avatar}
                        alt={other.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      {other.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{other.name}</h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{conv.lastMessage || 'Started conversation'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Message Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
                {(() => {
                  const other = selectedConv.participants.find((p) => p.id !== currentUser.id) || selectedConv.participants[0];
                  return (
                    <div className="flex items-center gap-3">
                      <img
                        src={other.avatar}
                        alt={other.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{other.name}</h3>
                        <span className="text-[11px] text-emerald-700 font-medium">Online · WorkStream Synchronized</span>
                      </div>
                    </div>
                  );
                })()}

                {selectedConv.contractId && (
                  <button
                    onClick={() => navigate(`/contracts/${selectedConv.contractId}`)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-lg hover:bg-emerald-100 transition flex items-center gap-1"
                  >
                    <Briefcase className="w-3.5 h-3.5" /> View Active Contract
                  </button>
                )}
              </div>

              {/* Messages Container */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div key={m.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <img
                          src={m.senderAvatar}
                          alt={m.senderName}
                          className="w-8 h-8 rounded-full object-cover mt-1 shrink-0"
                        />
                      )}

                      <div className={`max-w-md ${isMe ? 'text-right' : 'text-left'}`}>
                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed inline-block ${
                            isMe
                              ? 'bg-emerald-600 text-white rounded-br-none shadow-xs'
                              : 'bg-slate-100 text-slate-800 rounded-bl-none'
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex gap-2 bg-slate-50/50">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message or milestone specification..."
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:border-emerald-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={isSending || !messageInput.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 text-xs disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

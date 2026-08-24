'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { messagesAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Button, Input, LoadingSpinner, EmptyState } from '@/components/ui';
import { Send, Mail, MailOpen, ArrowLeft, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

interface Message {
  _id: string;
  subject: string;
  content: string;
  senderName: string;
  senderModel: string;
  recipientName: string;
  read: boolean;
  createdAt: string;
}

interface ComposeForm {
  recipientId: string;
  recipientModel: string;
  subject: string;
  content: string;
}

export default function MessagesPage() {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [composing, setComposing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { register, handleSubmit, reset } = useForm<ComposeForm>();

  useEffect(() => {
    loadMessages();
    loadUnread();
  }, [user]);

  const loadMessages = async () => {
    try {
      const res = await messagesAPI.inbox();
      setMessages(res.data);
    } catch {
      // empty inbox
    } finally {
      setLoading(false);
    }
  };

  const loadUnread = async () => {
    try {
      const res = await messagesAPI.unread();
      setUnreadCount(res.data.count || 0);
    } catch {
      // ignore
    }
  };

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      try {
        await messagesAPI.get(msg._id);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, read: true } : m))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        // ignore
      }
    }
  };

  const onSend = async (data: ComposeForm) => {
    setSending(true);
    try {
      await messagesAPI.send(data as unknown as Record<string, unknown>);
      reset();
      setComposing(false);
      loadMessages();
    } catch {
      // error
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading messages..." />;

  // Message detail view
  if (selected) {
    return (
      <div className="max-w-3xl space-y-4">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-2 text-sm text-ocean hover:underline"
        >
          <ArrowLeft size={16} /> Back to inbox
        </button>
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-carbon">{selected.subject}</h2>
              <p className="text-sm text-dim-grey">
                From: {selected.senderName} • {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
            <MailOpen size={20} className="text-ocean" />
          </div>
          <div className="prose prose-sm max-w-none text-carbon whitespace-pre-wrap">
            {selected.content}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Messages</h1>
          <p className="text-dim-grey text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <Button variant="accent" onClick={() => setComposing(!composing)}>
          <Send size={16} /> Compose
        </Button>
      </div>

      {/* Compose Form */}
      {composing && (
        <Card>
          <h3 className="font-semibold text-carbon mb-4">New Message</h3>
          <form onSubmit={handleSubmit(onSend)} className="space-y-3">
            <Input label="Recipient ID" placeholder="Student or User ID" {...register('recipientId', { required: true })} />
            <input type="hidden" {...register('recipientModel')} value="Student" />
            <Input label="Subject" placeholder="Subject" {...register('subject', { required: true })} />
            <textarea
              className="glory-input min-h-[120px] resize-y"
              placeholder="Write your message..."
              {...register('content', { required: true })}
            />
            <div className="flex gap-3">
              <Button type="submit" loading={sending}>Send</Button>
              <Button variant="secondary" type="button" onClick={() => setComposing(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Message List */}
      <Card padding={false}>
        {messages.length === 0 ? (
          <EmptyState
            icon={<MessageSquare />}
            title="No Messages"
            description="Your inbox is empty. Messages from staff and students will appear here."
          />
        ) : (
          <div>
            {messages.map((msg) => (
              <button
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={clsx(
                  'w-full text-left px-6 py-4 border-b border-charcoal/10 hover:bg-porcelain transition-colors flex items-center gap-4',
                  !msg.read && 'bg-ocean-light/20'
                )}
              >
                <div className={clsx(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  msg.read ? 'bg-transparent' : 'bg-ocean'
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={clsx(
                      'text-sm truncate',
                      msg.read ? 'text-dim-grey' : 'font-semibold text-carbon'
                    )}>
                      {msg.subject}
                    </p>
                    <span className="text-xs text-dim-grey ml-2 flex-shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-dim-grey mt-0.5">
                    From: {msg.senderName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

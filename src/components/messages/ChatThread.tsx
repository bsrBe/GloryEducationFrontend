'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { Button, LoadingSpinner } from '@/components/ui';

export interface ThreadMessage {
  _id: string;
  subject?: string;
  body: string;
  fromStudent: boolean;
  senderName: string;
  sentAt: string;
}

const POLL_INTERVAL_MS = 15000;

export function ChatThread({
  loadMessages,
  sendMessage,
  viewer,
  emptyText,
}: {
  // Keep both stable (useCallback): a new function restarts polling
  loadMessages: () => Promise<ThreadMessage[]>;
  sendMessage: (body: string) => Promise<void>;
  viewer: 'student' | 'staff';
  emptyText: string;
}) {
  const [messages, setMessages] = useState<ThreadMessage[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refresh = async () => {
    try {
      setMessages(await loadMessages());
      setLoadFailed(false);
    } catch {
      setLoadFailed(true);
    }
  };

  useEffect(() => {
    let active = true;
    const load = () => {
      loadMessages()
        .then((list) => {
          if (active) {
            setMessages(list);
            setLoadFailed(false);
          }
        })
        .catch(() => {
          if (active) setLoadFailed(true);
        });
    };
    const loadIfVisible = () => {
      if (document.visibilityState === 'visible') load();
    };

    load();
    const timer = setInterval(loadIfVisible, POLL_INTERVAL_MS);
    document.addEventListener('visibilitychange', loadIfVisible);
    return () => {
      active = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', loadIfVisible);
    };
  }, [loadMessages]);

  const messageCount = messages?.length ?? 0;
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messageCount]);

  const handleSend = async () => {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      await sendMessage(body);
      setDraft('');
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Message not sent. Please try again.'
      );
      setSending(false);
      return;
    }
    await refresh();
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[65vh] min-h-80">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {messages === null ? (
          loadFailed ? (
            <p className="text-sm text-red-text text-center py-10">Couldn&apos;t load messages. Retrying shortly...</p>
          ) : (
            <LoadingSpinner text="Loading messages..." />
          )
        ) : messages.length === 0 ? (
          <p className="text-sm text-dim-grey text-center py-10">{emptyText}</p>
        ) : (
          messages.map((msg) => {
            const mine = viewer === 'student' ? msg.fromStudent : !msg.fromStudent;
            return (
              <div key={msg._id} className={clsx('flex flex-col', mine ? 'items-end' : 'items-start')}>
                <p className="text-xs text-dim-grey mb-1">
                  {mine && viewer === 'student' ? 'You' : msg.senderName} •{' '}
                  {new Date(msg.sentAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
                <div
                  className={clsx(
                    'max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words',
                    mine ? 'bg-ocean text-white rounded-br-sm' : 'bg-porcelain text-carbon border border-line rounded-bl-sm'
                  )}
                >
                  {msg.subject && <p className="font-semibold mb-1">{msg.subject}</p>}
                  {msg.body}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        className="border-t border-line p-3 sm:p-4 flex items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <label htmlFor="chat-message" className="sr-only">Message</label>
        <textarea
          id="chat-message"
          className="glory-input flex-1 min-h-[44px] max-h-40 resize-y"
          rows={2}
          maxLength={5000}
          placeholder="Write a message... (Enter to send, Shift+Enter for a new line)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button type="submit" loading={sending} disabled={!draft.trim()} aria-label="Send message">
          <Send size={16} /> Send
        </Button>
      </form>
    </div>
  );
}

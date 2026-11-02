'use client';

import { useCallback, useEffect, useState } from 'react';
import { messagesAPI, studentsAPI } from '@/lib/api';
import { Card, Button, Input, LoadingSpinner } from '@/components/ui';
import { ChatThread, ThreadMessage } from '@/components/messages/ChatThread';
import { ArrowLeft, MessageSquare, Plus, Search, X } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';

interface StudentSummary {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  studentId?: string;
}

interface Conversation extends StudentSummary {
  lastMessage: string;
  lastMessageAt: string;
  lastFromStudent: boolean;
  unreadCount: number;
}

const POLL_INTERVAL_MS = 15000;

const fullName = (s: StudentSummary) => `${s.firstName || ''} ${s.lastName || ''}`.trim() || s.email || 'Student';

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [selected, setSelected] = useState<StudentSummary | null>(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StudentSummary[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const refreshConversations = useCallback(async () => {
    try {
      const res = await messagesAPI.conversations();
      setConversations(res.data || []);
    } catch {
      setConversations((prev) => prev ?? []);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = () => {
      messagesAPI
        .conversations()
        .then((res) => {
          if (active) setConversations(res.data || []);
        })
        .catch(() => {
          if (active) setConversations((prev) => prev ?? []);
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
  }, []);

  const selectedId = selected?._id;
  const loadMessages = useCallback(async (): Promise<ThreadMessage[]> => {
    if (!selectedId) return [];
    const res = await messagesAPI.conversation(selectedId);
    return res.data.messages || [];
  }, [selectedId]);

  const sendMessage = useCallback(
    async (body: string) => {
      if (!selectedId) return;
      await messagesAPI.send({ recipientId: selectedId, recipientModel: 'Student', body });
      refreshConversations();
    },
    [selectedId, refreshConversations]
  );

  const openConversation = (student: StudentSummary) => {
    setSelected(student);
    setSearching(false);
    setQuery('');
    setResults(null);
    // Opening the thread marks it read on the server; reflect that right away
    setConversations((prev) => prev?.map((c) => (c._id === student._id ? { ...c, unreadCount: 0 } : c)) ?? prev);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const search = query.trim();
    if (!search) return;
    setSearchLoading(true);
    try {
      const res = await studentsAPI.list({ search, limit: 8 });
      setResults(res.data.students || []);
    } catch {
      toast.error('Student search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const totalUnread = conversations?.reduce((sum, c) => sum + c.unreadCount, 0) ?? 0;

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Messages</h1>
          <p className="text-dim-grey text-sm mt-1">
            {totalUnread > 0 ? `${totalUnread} unread from students` : 'Conversations with students'}
          </p>
        </div>
        <Button variant="accent" onClick={() => setSearching((s) => !s)}>
          {searching ? <X size={16} /> : <Plus size={16} />} {searching ? 'Close' : 'New message'}
        </Button>
      </div>

      {searching && (
        <Card>
          <form onSubmit={handleSearch} className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                id="student-search"
                label="Find a student"
                placeholder="Name, email, or student ID (e.g. GH26-000001)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" loading={searchLoading} aria-label="Search students">
              <Search size={16} /> Search
            </Button>
          </form>
          {results && (
            <div className="mt-4 space-y-1">
              {results.length === 0 ? (
                <p className="text-sm text-dim-grey">No students match &quot;{query}&quot;.</p>
              ) : (
                results.map((s) => (
                  <button
                    key={s._id}
                    onClick={() => openConversation(s)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-porcelain transition-colors"
                  >
                    <p className="text-sm font-medium text-carbon">{fullName(s)}</p>
                    <p className="text-xs text-dim-grey">{[s.studentId, s.email].filter(Boolean).join(' • ')}</p>
                  </button>
                ))
              )}
            </div>
          )}
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-[300px_1fr]">
        {/* Conversation list */}
        <Card padding={false} className={clsx('overflow-hidden', selected && 'hidden md:block')}>
          {conversations === null ? (
            <LoadingSpinner text="Loading conversations..." />
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center text-sm text-dim-grey">
              <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
              No conversations yet. Use New message to write to a student.
            </div>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c._id}
                  onClick={() => openConversation(c)}
                  className={clsx(
                    'w-full text-left px-4 py-3 border-b border-charcoal/10 hover:bg-porcelain transition-colors',
                    selectedId === c._id && 'bg-porcelain'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={clsx('text-sm truncate', c.unreadCount > 0 ? 'font-semibold text-carbon' : 'text-carbon')}>
                      {fullName(c)}
                    </p>
                    {c.unreadCount > 0 && (
                      <span className="flex-shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-ocean text-white text-xs font-semibold flex items-center justify-center">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-dim-grey truncate mt-0.5">
                    {c.lastFromStudent ? '' : 'Team: '}
                    {c.lastMessage}
                  </p>
                  <p className="text-[11px] text-dim-grey mt-0.5">
                    {new Date(c.lastMessageAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Open conversation */}
        <Card padding={false} className={clsx(!selected && 'hidden md:block')}>
          {selected ? (
            <>
              <div className="flex items-center gap-3 border-b border-line px-4 sm:px-6 py-3">
                <button
                  onClick={() => setSelected(null)}
                  className="md:hidden p-1 -ml-1 text-ocean"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="min-w-0">
                  <p className="font-semibold text-carbon truncate">{fullName(selected)}</p>
                  <p className="text-xs text-dim-grey truncate">
                    {[selected.studentId, selected.email].filter(Boolean).join(' • ')}
                  </p>
                </div>
              </div>
              <ChatThread
                key={selected._id}
                loadMessages={loadMessages}
                sendMessage={sendMessage}
                viewer="staff"
                emptyText={`No messages with ${fullName(selected)} yet. Write the first one below.`}
              />
            </>
          ) : (
            <div className="h-full min-h-80 flex items-center justify-center p-6 text-sm text-dim-grey text-center">
              Choose a conversation, or start one with New message.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

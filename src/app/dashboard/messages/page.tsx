'use client';

import { useCallback } from 'react';
import { messagesAPI } from '@/lib/api';
import { Card } from '@/components/ui';
import { ChatThread, ThreadMessage } from '@/components/messages/ChatThread';

export default function MessagesPage() {
  const loadMessages = useCallback(async (): Promise<ThreadMessage[]> => {
    const res = await messagesAPI.thread();
    return res.data.messages || [];
  }, []);

  const sendMessage = useCallback(async (body: string) => {
    await messagesAPI.send({ body });
  }, []);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">Messages</h1>
        <p className="text-dim-grey text-sm mt-1">
          Questions about your documents or application? Send the Veridan team a message here.
        </p>
      </div>

      <Card padding={false}>
        <ChatThread
          loadMessages={loadMessages}
          sendMessage={sendMessage}
          viewer="student"
          emptyText="No messages yet. Write to the Veridan team below."
        />
      </Card>
    </div>
  );
}

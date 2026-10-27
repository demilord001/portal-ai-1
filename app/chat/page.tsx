import { useState, useRef, FormEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import { NextPage } from 'next';
import Image from 'next/image';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const ChatPage: NextPage = () => {
  const { isSignedIn, user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const convoEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    convoEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/grok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], useWebSearch: true }),
      });
      const data = await res.json();
      const assistantMsg: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
        <p className="text-xl font-medium text-gray-700">Please sign in to use the chat.</p>
      </div>
    );
  }

  return (
    <main className="flex h-screen flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="flex items-center justify-between bg-white/70 p-4 backdrop-blur-md dark:bg-gray-800/70">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">PORTAL.AI Chat</h1>
        <div className="flex items-center gap-2">
          {user?.imageUrl && (
            <Image src={user.imageUrl} alt={user.fullName ?? 'User'} width={32} height={32} className="rounded-full" />
          )}
          <span className="text-sm text-gray-600 dark:text-gray-300">{user?.fullName ?? 'User'}</span>
        </div>
      </header>

      {/* Conversation */}
      <section className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-xl self-${msg.role === 'user' ? 'end' : 'start'} rounded-xl p-4 shadow-sm ${msg.role === 'assistant' ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-white dark:bg-gray-800'} animate-fade-in`}
            >
              <p className="break-words whitespace-pre-wrap text-gray-800 dark:text-gray-100">{msg.content}</p>
            </div>
          ))}
          <div ref={convoEndRef} />
        </div>
      </section>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 bg-white/70 p-4 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/70">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="flex items-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
          {loading ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="4" />
            </svg>
          ) : (
            'Send'
          )}
        </button>
      </form>
    </main>
  );
};

export default ChatPage;

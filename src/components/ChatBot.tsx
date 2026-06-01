import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Loader2, Volume2, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { useReadAloud } from '../hooks/useReadAloud';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

// Helper to strip common markdown syntax for a cleaner voice output
const stripMarkdown = (text: string) => {
  return text
    // Replace horizontal rules or bold italic markers first
    .replace(/\*\*\*/g, '')
    .replace(/___/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italic
    .replace(/__(.*?)__/g, '$1') // bold
    .replace(/_(.*?)_/g, '$1') // italic
    .replace(/~~(.*?)~~/g, '$1') // strikethrough
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/```[\s\S]*?```/g, ' ') // code blocks remove content inside to prevent reading code
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/^#+\s+/gm, '') // headers
    .replace(/^>+\s+/gm, '') // blockquotes
    .replace(/^[-*+]\s+/gm, '') // unordered lists
    .replace(/^\d+\.\s+/gm, '') // ordered lists
    // Replace any remaining standalone asterisks just in case
    .replace(/\*/g, '')
    .trim();
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const { isPlaying, speak, stop } = useReadAloud();
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi! I am an AI assistant here to help you learn more about Arunava. Ask me anything about his projects, skills, or experience!',
      role: 'assistant',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isPlaying) {
      setActiveMessageId(null);
    }
  }, [isPlaying]);

  const handleToggleVoice = (msgId: string, text: string) => {
    if (activeMessageId === msgId && isPlaying) {
      stop();
      setActiveMessageId(null);
    } else {
      speak(stripMarkdown(text));
      setActiveMessageId(msgId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (isPlaying) {
      stop();
      setActiveMessageId(null);
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), content: userMessage, role: 'user' }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }],
          language: i18n.language
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Network response was not ok');
      }
      
      const data = await response.json();
      
      const botResponse = data.reply || "I'm sorry, I couldn't understand that.";
      const newMsgId = Date.now().toString();
      
      setMessages(prev => [...prev, {
        id: newMsgId,
        content: botResponse,
        role: 'assistant',
      }]);
      
      // Auto-play response
      const cleanResponse = stripMarkdown(botResponse);
      speak(cleanResponse);
      setActiveMessageId(newMsgId);
    } catch (error: any) {
      console.error('Error in chat:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: `Sorry, I had an error: ${error?.message || "Please try again later."}`,
        role: 'assistant',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 p-4 rounded-full bg-brand-blue text-white shadow-lg hover:bg-brand-blue/90 transition-all z-40 ${isOpen ? 'scale-0' : 'scale-100'} focus:outline-none focus:ring-4 focus:ring-brand-blue/30`}
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
            style={{ originX: 1, originY: 1 }}
            className="fixed bottom-24 right-4 md:bottom-[90px] md:right-8 w-[calc(100%-2rem)] max-w-[360px] h-[500px] max-h-[80vh] z-50 flex flex-col glass-card border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-white">AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50 dark:bg-black/10">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1">
                      {msg.role === 'user' ? (
                        <div className="bg-slate-200 dark:bg-slate-700 w-full h-full rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                        </div>
                      ) : (
                        <div className="bg-brand-blue/20 w-full h-full rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-brand-blue" />
                        </div>
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-2xl relative group ${
                        msg.role === 'user'
                          ? 'bg-brand-blue text-white rounded-tr-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="markdown-body max-w-none break-words pr-6">
                          <Markdown>{msg.content}</Markdown>
                          <button
                            onClick={() => handleToggleVoice(msg.id, msg.content)}
                            className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-brand-blue transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
                            title={(activeMessageId === msg.id && isPlaying) ? "Stop Reading" : "Read Aloud"}
                          >
                            {(activeMessageId === msg.id && isPlaying) ? (
                              <Square className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-brand-blue" />
                    </div>
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-tl-sm flex items-center gap-2 text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me something..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-transparent focus:border-brand-blue dark:focus:border-brand-blue rounded-xl px-4 py-2 outline-none transition-colors text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 justify-center flex items-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

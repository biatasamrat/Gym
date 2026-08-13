import React, { useState, useRef, useEffect } from 'react';
import { Member } from '../types';
import { Send, Bot, User, Sparkles, RefreshCw, Copy, Check, Dumbbell, Flame, HeartPulse, HelpCircle, AlertCircle } from 'lucide-react';

interface AIChatbotProps {
  member: Member;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "How to build bigger biceps peak & arm thickness?",
  "Best chest workout routine for mass & upper chest?",
  "How many grams of protein should I consume daily?",
  "Proper squat form guide to protect my knees",
  "How to fix lower back pain after deadlifts?",
  "3-day workout split for beginners"
];

export const AIChatbot: React.FC<AIChatbotProps> = ({
  member,
  initialPrompt,
  onClearInitialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Hello ${member.fullName}! 👋 I am your **FitFlow AI Fitness Coach**. 

I am powered by Google Gemini API to assist you with:
• **Exercise Form & Technique** (Biceps, Triceps, Chest, Back, Shoulders, Legs, Abs)
• **Custom Workout Split & Routines**
• **Nutrition & Daily Protein Goals**
• **Injury Prevention & Recovery**

What fitness query would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle auto-trigger if initialPrompt is passed from Workout Library or other component
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() !== '') {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText || messageText.trim() === '' || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Send history and context to Express endpoint /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
          memberContext: {
            fullName: member.fullName,
            fitnessGoal: member.fitnessGoal || 'General Health & Mass',
            currentDuration: member.currentDuration,
          },
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || "I'm having trouble getting a response right now. Please try again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error contacting AI Assistant endpoint:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: "⚠️ Sorry, unable to connect to the FitFlow AI server right now. Please check your internet connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm("Clear chat history with FitFlow AI Coach?")) {
      setMessages([
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'ai',
          text: `Chat cleared! How can I help you next, ${member.fullName}?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
      
      {/* Top AI Chat Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md border border-blue-400/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-white text-base">FitFlow AI Fitness Coach</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Google Gemini AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-300">Personalized exercise, form & nutrition assistant</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition text-xs flex items-center space-x-1"
          title="Reset conversation"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset Chat</span>
        </button>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="bg-slate-50 border-b border-slate-100 p-3 overflow-x-auto whitespace-nowrap flex items-center space-x-2 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center mr-1">
          <HelpCircle className="w-3 h-3 mr-1 text-blue-500" /> Quick Ask:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-700 text-xs font-semibold rounded-full border border-slate-200 transition shadow-2xs shrink-0 flex items-center space-x-1.5"
          >
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-br from-slate-800 to-slate-900 text-blue-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isUser ? 'items-end' : ''}`}>
                <div className={`flex items-center space-x-2 text-[10px] text-slate-400 ${isUser ? 'justify-end' : ''}`}>
                  <span>{isUser ? member.fullName : 'FitFlow AI Coach'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {!isUser && (
                  <button
                    onClick={() => handleCopyText(msg.id, msg.text)}
                    className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 flex items-center space-x-1 pt-1"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600">Copied to clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy answer</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center shrink-0 border border-slate-700">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>FitFlow AI Coach is composing your fitness response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-4 bg-white border-t border-slate-200 flex items-center space-x-3 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Coach about exercises (biceps, triceps, chest, legs), reps, protein..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-2xl transition shadow-md flex items-center space-x-2 shrink-0"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

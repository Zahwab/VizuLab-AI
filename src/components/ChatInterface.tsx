import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Sparkles, Activity } from 'lucide-react';

export interface Message {
    role: 'user' | 'system';
    content: string;
}

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (msg: string) => void;
    isLoading: boolean;
}

const QUICK_STARTS = [
    { label: "Simulate Gravity", icon: Activity },
    { label: "Wave Interference", icon: Sparkles },
    { label: "Solar System Orbit", icon: Cpu }
];

export const ChatInterface = ({ messages, onSendMessage, isLoading }: ChatInterfaceProps) => {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput("");
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900/80 p-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-purple-400 font-mono text-sm tracking-wider flex items-center gap-2">
                    <Cpu size={16} /> LAB NOTEBOOK // V.1.0
                </h2>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div className={`
              max-w-[90%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
              ${msg.role === 'user'
                                ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-100 rounded-br-none'
                                : 'bg-slate-800/60 border border-white/5 text-slate-300 rounded-bl-none'}
            `}>
                            {msg.content}
                        </div>
                        <span className="text-[10px] text-slate-600 mt-1 uppercase">
                            {msg.role === 'user' ? 'YOU' : 'SYSTEM_AI'}
                        </span>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start flex-col">
                        <div className="bg-slate-800/40 border border-purple-500/30 p-3 rounded-lg rounded-bl-none flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-150"></span>
                        </div>
                        <span className="text-[10px] text-purple-500/70 mt-1 uppercase animate-pulse">Computing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/80 border-t border-white/5 space-y-3">
                {/* Quick Starts */}
                {messages.length === 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {QUICK_STARTS.map((chip) => (
                            <button
                                key={chip.label}
                                onClick={() => onSendMessage(chip.label)}
                                disabled={isLoading}
                                className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-white/10 text-slate-400 hover:text-purple-400 hover:border-purple-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <chip.icon size={12} />
                                {chip.label}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        placeholder="Describe simulation parameters..."
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600 font-mono disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/40 hover:text-indigo-200 hover:border-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

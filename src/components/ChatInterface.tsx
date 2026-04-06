import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Sparkles, Activity, History } from 'lucide-react';

export interface Message {
    role: 'user' | 'system';
    content: string;
}

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (msg: string, method: string, aiModel: string) => void;
    isLoading: boolean;
    onToggleHistory?: () => void;
}

const QUICK_STARTS = [
    { label: "Simulate Gravity", icon: Activity },
    { label: "Wave Interference", icon: Sparkles },
    { label: "Solar System Orbit", icon: Cpu }
];

export const ChatInterface = ({ messages, onSendMessage, isLoading, onToggleHistory }: ChatInterfaceProps) => {
    const [input, setInput] = useState("");
    const [method, setMethod] = useState("Auto-Detect");
    const [aiModel, setAiModel] = useState("google/gemma-3n-e4b-it:free");
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
            onSendMessage(input.trim(), method, aiModel);
            setInput("");
        }
    };

    return (
        <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(0,240,255,0.15)] relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-accent to-transparent opacity-50"></div>
            {/* Header */}
            <div className="bg-surface/80 p-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-teal-accent font-heading text-[10px] tracking-widest flex items-center gap-2">
                    <Cpu size={14} /> LAB TERMINAL // V.2.0
                </h2>
                <div className="flex gap-4 items-center">
                    {onToggleHistory && (
                        <button 
                            onClick={onToggleHistory}
                            className="text-[10px] flex items-center gap-1.5 font-mono text-teal-accent/50 hover:text-teal-accent hover:bg-teal-accent/10 px-2 py-1 rounded transition-all tracking-widest uppercase tooltip"
                            title="Cloud Archives"
                            type="button"
                        >
                            <History size={12} />
                            <span className="hidden sm:inline">HISTORY</span>
                        </button>
                    )}
                    <div className="flex gap-2 items-center">
                        <div className="text-[9px] font-mono text-teal-accent/50 tracking-widest uppercase hidden sm:block">Subspace Link</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-accent animate-pulse-glow shadow-[0_0_8px_var(--accent-teal)]"></div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 font-mono text-[13px] custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in-up`}
                        style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                        <div className={`
              max-w-[90%] p-4 rounded-xl leading-relaxed shadow-sm relative overflow-hidden backdrop-blur-sm
              ${msg.role === 'user'
                                ? 'bg-teal-muted border border-teal-accent/20 text-teal-50 rounded-br-none shadow-[0_0_15px_var(--accent-teal-muted)]'
                                : 'bg-surface/50 border border-white/5 text-slate-300 rounded-bl-none'}
            `}>
                            {msg.role === 'user' && <div className="absolute top-0 right-0 w-8 h-8 bg-teal-accent/20 blur-xl"></div>}
                            {msg.content}
                        </div>
                        <span className="text-[10px] text-slate-600 mt-1 uppercase">
                            {msg.role === 'user' ? 'YOU' : 'SYSTEM_AI'}
                        </span>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start flex-col animate-fade-in-up">
                        <div className="bg-surface/50 border border-teal-accent/20 p-3 rounded-lg rounded-bl-none flex items-center gap-3 relative overflow-hidden">
                            <div className="absolute inset-0 bg-teal-accent/5 animate-pulse-slow"></div>
                            <span className="w-1.5 h-1.5 bg-teal-accent rounded-full animate-bounce shadow-[0_0_8px_var(--accent-teal)]"></span>
                            <span className="w-1.5 h-1.5 bg-magenta-accent rounded-full animate-bounce delay-75 shadow-[0_0_8px_var(--accent-magenta)]"></span>
                            <span className="w-1.5 h-1.5 bg-teal-accent rounded-full animate-bounce delay-150 shadow-[0_0_8px_var(--accent-teal)]"></span>
                        </div>
                        <span className="text-[9px] text-teal-accent/70 mt-2 uppercase tracking-[0.2em] font-bold animate-pulse">Compiling Sequence...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface/90 border-t border-white/5 space-y-3 relative">
                {/* Accent glow line */}
                <div className="absolute top-[-1px] left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-teal-accent/30 to-transparent"></div>
                {/* Quick Starts */}
                {messages.length === 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {QUICK_STARTS.map((chip) => (
                            <button
                                key={chip.label}
                                onClick={() => onSendMessage(chip.label, method, aiModel)}
                                disabled={isLoading}
                                className="text-[11px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-white/5 text-slate-300 hover:text-teal-accent hover:border-teal-accent/50 hover:bg-teal-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed group tracking-wide shadow-sm"
                            >
                                <chip.icon size={12} className="text-teal-accent/70 group-hover:text-teal-accent transition-colors" />
                                {chip.label}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-2">
                    <div className="grid grid-cols-2 lg:flex gap-2 w-full lg:w-auto shrink-0">
                        <select
                            value={aiModel}
                            onChange={(e) => setAiModel(e.target.value)}
                            disabled={isLoading}
                            className="w-full lg:w-[130px] bg-black/40 border border-white/10 rounded-xl px-2 py-3 text-[11px] text-teal-50 focus:outline-none focus:border-teal-accent/50 focus:bg-surface focus:ring-1 focus:ring-teal-accent/20 transition-all font-mono disabled:opacity-50 shadow-inner cursor-pointer truncate"
                            title="AI Model"
                        >
                            <optgroup label="── Top Simulation ──">
                                <option value="google/gemma-3n-e4b-it:free">🆓 Gemma 3n 4B 🏆</option>
                                <option value="google/gemma-3n-e2b-it:free">🆓 Gemma 3n 2B ⭐</option>
                                <option value="nvidia/nemotron-3-nano-30b-a3b">Nemotron 3 Nano 30B</option>
                                <option value="arcee-ai/trinity-large-preview:free">🆓 Trinity Large Preview</option>
                                <option value="stepfun/step-3.5-flash">Step 3.5 Flash</option>
                            </optgroup>
                            <optgroup label="── Top Text ──">
                                <option value="arcee-ai/trinity-mini">Trinity Mini</option>
                                <option value="nvidia/nemotron-nano-9b-v2">Nemotron Nano 9B V2</option>
                            </optgroup>
                        </select>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            disabled={isLoading}
                            className="w-full lg:w-[130px] bg-black/40 border border-white/10 rounded-xl px-2 py-3 text-[11px] text-teal-50 focus:outline-none focus:border-teal-accent/50 focus:bg-surface focus:ring-1 focus:ring-teal-accent/20 transition-all font-mono disabled:opacity-50 shadow-inner cursor-pointer truncate"
                            title="Simulation Model/Engine"
                        >
                            <option value="Auto-Detect">Auto Engine (Let AI Decide)</option>
                            <option value="p5.js">p5.js (Best for 2D Art)</option>
                            <option value="Three.js">Three.js (Best for 3D)</option>
                            <option value="Canvas API">Vanilla Canvas (High Speed 2D)</option>
                        </select>
                    </div>

                    <div className="flex gap-2 flex-1 w-full min-w-0">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder="Initialize protocol sequence..."
                            className="flex-1 min-w-0 w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[13px] text-teal-50 focus:outline-none focus:border-teal-accent/50 focus:bg-surface focus:ring-1 focus:ring-teal-accent/20 transition-all placeholder:text-slate-500/70 font-mono disabled:opacity-50 shadow-inner truncate"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="shrink-0 p-3 w-[46px] h-full flex items-center justify-center rounded-xl bg-teal-muted border border-teal-accent/30 text-teal-accent hover:bg-teal-accent/30 hover:text-white hover:border-teal-accent hover:shadow-[0_0_15px_var(--accent-teal-muted)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-accent/0 via-teal-accent/20 to-teal-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <Send size={18} className="relative z-10 group-hover:-rotate-12 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { History, X, Trash2, Clock, Play, Copy, Check } from 'lucide-react';

export interface HistoryItem {
    id: string;
    prompt: string;
    method: string;
    aiModel: string;
    code: string;
    timestamp: number;
}

interface HistoryPanelProps {
    items: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onClose: () => void;
    onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ items, onSelect, onClose, onClearHistory }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (e: React.MouseEvent, item: HistoryItem) => {
        e.stopPropagation();
        navigator.clipboard.writeText(item.code);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex flex-col h-full glass-panel rounded-2xl overflow-hidden transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(0,240,255,0.15)] relative animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-accent to-transparent opacity-50"></div>
            
            {/* Header */}
            <div className="bg-surface/80 p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <h2 className="text-teal-accent font-heading text-[10px] tracking-widest flex items-center gap-2">
                    <History size={14} /> CLOUD ARCHIVES
                </h2>
                <div className="flex gap-3 items-center">
                    <button 
                        onClick={onClearHistory} 
                        className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors tooltip"
                        title="Clear History"
                    >
                        <Trash2 size={12} />
                    </button>
                    <button 
                        onClick={onClose} 
                        className="p-1.5 rounded bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                        title="Close History"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[13px] custom-scrollbar">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50 gap-3">
                        <History size={32} />
                        <span className="text-[10px] tracking-widest uppercase">No Archives Found</span>
                    </div>
                ) : (
                    items.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-surface/50 border border-white/5 rounded-xl p-3 hover:border-teal-accent/30 hover:bg-teal-muted/30 transition-all group flex flex-col gap-2 cursor-pointer relative overflow-hidden"
                            onClick={() => onSelect(item)}
                        >
                            <div className="flex items-center justify-between text-[10px] text-teal-accent/60">
                                <div className="flex items-center gap-2">
                                    <Clock size={10} />
                                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                                    {item.aiModel}
                                </div>
                            </div>
                            
                            <p className="text-slate-300 line-clamp-2 leading-relaxed">
                                "{item.prompt}"
                            </p>
                            
                            <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                                <span className="text-[9px] text-slate-500 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-magenta-accent inline-block"></span>
                                    {item.method}
                                </span>
                                
                                <div className="flex items-center gap-2 text-teal-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => handleCopy(e, item)}
                                        className="flex items-center gap-1 text-[10px] hover:text-white transition-colors bg-teal-accent/10 px-1.5 py-0.5 rounded"
                                        title="Copy HTML Code"
                                    >
                                        {copiedId === item.id ? <Check size={10} /> : <Copy size={10} />}
                                        {copiedId === item.id ? "COPIED" : "COPY CODE"}
                                    </button>
                                    <div className="flex items-center gap-1 text-[10px] hover:text-white transition-colors bg-teal-accent/10 px-1.5 py-0.5 rounded">
                                        <Play size={10} />
                                        LOAD PREVIEW
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* Footer gradient */}
            <div className="h-10 bg-gradient-to-t from-surface to-transparent absolute bottom-0 left-0 right-0 pointer-events-none"></div>
        </div>
    );
};

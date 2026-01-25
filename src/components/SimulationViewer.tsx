import React, { useEffect, useRef, useState } from 'react';
import { Code, Eye, Copy, Check } from 'lucide-react';

interface SimulationViewerProps {
    codeString: string;
}

export const SimulationViewer: React.FC<SimulationViewerProps> = ({ codeString }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (iframeRef.current && codeString && viewMode === 'preview') {
            iframeRef.current.srcdoc = codeString;
        }
    }, [codeString, viewMode]);

    const handleCopy = async () => {
        if (!codeString) return;
        try {
            await navigator.clipboard.writeText(codeString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="w-full h-full bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl relative flex flex-col">
            {/* Header */}
            <div className="h-10 bg-slate-900/80 border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-10 w-full">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    <span className="text-xs text-slate-400 font-mono ml-3 tracking-wider">
                        VIEWPORT // {viewMode === 'preview' ? 'RENDER_E01' : 'SOURCE_CODE'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {viewMode === 'code' && (
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                            title="Copy Code"
                        >
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                    )}
                    <div className="flex bg-slate-800/50 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all ${viewMode === 'preview'
                                ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Eye size={12} /> Preview
                        </button>
                        <button
                            onClick={() => setViewMode('code')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all ${viewMode === 'code'
                                ? 'bg-indigo-500/20 text-indigo-300 shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Code size={12} /> Code
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 relative overflow-hidden bg-black/20">
                {!codeString ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 flex-col space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-2 border-slate-700/50 border-t-purple-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                            </div>
                        </div>
                        <p className="font-mono text-xs tracking-[0.2em] uppercase text-slate-400/60 animate-pulse">Awaiting Input Data...</p>
                    </div>
                ) : (
                    <>
                        {/* Preview Mode */}
                        <div className={`w-full h-full ${viewMode === 'preview' ? 'block' : 'hidden'}`}>
                            <iframe
                                ref={iframeRef}
                                title="Simulation Output"
                                className="w-full h-full border-none"
                                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                            />
                        </div>

                        {/* Code Mode */}
                        <div className={`w-full h-full overflow-auto custom-scrollbar p-0 ${viewMode === 'code' ? 'block' : 'hidden'}`}>
                            <pre className="text-xs font-mono p-4 text-slate-300 coding-font w-full h-full bg-[#0d1117]">
                                <code>{codeString}</code>
                            </pre>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

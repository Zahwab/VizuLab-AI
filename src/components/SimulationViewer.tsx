import React, { useEffect, useRef, useState } from 'react';
import { Code, Eye, Copy, Check, RotateCcw } from 'lucide-react';
import Editor, { type Monaco, type OnMount } from "@monaco-editor/react";

interface SimulationViewerProps {
    codeString: string;
}

export const SimulationViewer: React.FC<SimulationViewerProps> = ({ codeString }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
    const [copied, setCopied] = useState(false);

    // State to track the code being edited/viewed
    const [editableCode, setEditableCode] = useState<string>(codeString);

    // Sync prop updates to state, but only if we haven't dirtied it?
    // Actually, usually if the parent generates a NEW simulation, we want to overwrite.
    // If we just typing, we don't want to overwrite.
    // Let's assume if codeString prop changes (new generation), we reset.
    useEffect(() => {
        setEditableCode(codeString);
    }, [codeString]);

    // Use editableCode for display/preview
    const displayCode = editableCode;

    useEffect(() => {
        if (iframeRef.current && displayCode && viewMode === 'preview') {
            // Inject styles to force full viewport
            const resetStyle = `<style>
                body, html { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; }
                canvas { display: block; width: 100% !important; height: 100% !important; }
            </style>`;

            // Try to insert after <head> if it exists, otherwise prepend
            let finalCode = displayCode;
            if (finalCode.includes('<head>')) {
                finalCode = finalCode.replace('<head>', '<head>' + resetStyle);
            } else {
                finalCode = resetStyle + finalCode;
            }

            iframeRef.current.srcdoc = finalCode;
        }
    }, [displayCode, viewMode]);

    const handleCopy = async () => {
        if (!displayCode) return;
        try {
            await navigator.clipboard.writeText(displayCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset your code changes?")) {
            setEditableCode(codeString);
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setEditableCode(value);
        }
    };

    // Custom configuration for Monaco to add requested features
    const handleEditorDidMount: OnMount = (_editor: unknown, monaco: Monaco) => {
        // Example: Add a custom completion provider for 'html' to suggest printf
        monaco.languages.registerCompletionItemProvider("html", {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            provideCompletionItems: (model: any, position: any) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                return {
                    suggestions: [
                        {
                            label: "printf",
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: "console.log('${1:message}');",
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: "Log output to console (C-style alias)",
                            range: range,
                        },
                        {
                            label: "print",
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: "console.log('${1:message}');",
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: "Print to console",
                            range: range,
                        },
                    ],
                };
            },
        });
    };

    return (
        <div className="w-full flex-1 min-h-0 bg-slate-900/60 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl relative flex flex-col">
            {/* Header */}
            <div className="h-10 bg-slate-900/80 flex items-center justify-between px-2 sm:px-4 shrink-0 z-10 w-full border-b border-white/5 overflow-hidden">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="flex shrink-0 gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-xs text-slate-400 font-mono ml-3 tracking-wider truncate hidden sm:inline-block">
                        VIEWPORT // {viewMode === 'preview' ? 'RENDER_LIVE' : 'EDITOR_MODE'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-3 tracking-wider truncate sm:hidden">
                       // {viewMode === 'preview' ? 'LIVE' : 'EDIT'}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                    {viewMode === 'code' && (
                        <>
                            <button
                                onClick={handleReset}
                                className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors mr-1"
                                title="Reset Code"
                            >
                                <RotateCcw size={14} />
                            </button>
                            <button
                                onClick={handleCopy}
                                className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                title="Copy Code"
                            >
                                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            </button>
                        </>
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
                            <Code size={12} /> Editor
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 relative overflow-hidden bg-black/20 flex flex-col min-h-0">
                {!codeString && viewMode === 'preview' ? (
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
                        <div className={`absolute inset-0 bg-white ${viewMode === 'preview' ? 'block' : 'hidden'}`}>
                            <iframe
                                ref={iframeRef}
                                title="Simulation Output"
                                className="w-full h-full border-none block"
                                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                            />
                        </div>

                        {/* Code Mode */}
                        <div className={`absolute inset-0 bg-[#1e1e1e] ${viewMode === 'code' ? 'block' : 'hidden'}`}>
                            <Editor
                                height="100%"
                                defaultLanguage="html"
                                value={editableCode}
                                onChange={handleEditorChange}
                                onMount={handleEditorDidMount}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: true },
                                    fontSize: 13,
                                    wordWrap: 'on',
                                    automaticLayout: true,
                                    tabSize: 2,
                                    scrollBeyondLastLine: false,
                                    padding: { top: 16, bottom: 16 },
                                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                                    fontLigatures: true
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

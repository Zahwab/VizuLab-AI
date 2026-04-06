import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import type { Message } from './components/ChatInterface';
import { SimulationViewer } from './components/SimulationViewer';
import { generateSimulation } from './lib/llm';
import { Atom } from 'lucide-react';
import { HistoryPanel } from './components/HistoryPanel';
import type { HistoryItem } from './components/HistoryPanel';

// Declare puter global to avoid TS errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const puter: any;

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: "Welcome to VizuLab AI. I can generate any visualization or simulation you describe (<–^–>_±_<–^–>)" }
  ]);
  const [codeString, setCodeString] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    async function loadHistory() {
      // Check if puter is available
      if (typeof puter !== 'undefined' && puter.fs) {
        try {
          const fileContent = await puter.fs.read('vizulab_history.json');
          const text = await fileContent.text();
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            setHistoryItems(parsed);
          }
        } catch (err) {
          console.log("No history found or error reading", err);
        }
      }
    }
    loadHistory();
  }, []);

  const saveToHistory = async (newItem: HistoryItem) => {
    const updatedHistory = [newItem, ...historyItems].slice(0, 50); // Keep last 50
    setHistoryItems(updatedHistory);
    
    if (typeof puter !== 'undefined' && puter.fs) {
      try {
        await puter.fs.write('vizulab_history.json', JSON.stringify(updatedHistory));
      } catch (err) {
        console.error("Failed to save history", err);
      }
    }
  };

  const handleSendMessage = async (input: string, method: string, aiModel: string) => {
    // Add user message
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Generate simulation
      const code = await generateSimulation(input, method, aiModel);

      setCodeString(code);

      // Save to cloud history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        prompt: input,
        method,
        aiModel,
        code,
        timestamp: Date.now()
      };
      await saveToHistory(newItem);

      // Add system response
      const systemMsg: Message = {
        role: 'system',
        content: `Generated simulation for: "${input}"`
      };
      setMessages(prev => [...prev, systemMsg]);
    } catch (error: unknown) {
      let errorMessage = "Failed to generate";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      const errorMsg: Message = { role: 'system', content: `Error: ${errorMessage}` };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Left Panel: Visualization (approx 55% mobile, 70% desktop) */}
      <div className="flex flex-col gap-3 lg:gap-4 w-full lg:flex-[7] min-h-[50vh] lg:min-h-0 shrink-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between px-2 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-teal-muted rounded-xl border border-teal-accent/30 shadow-[0_0_15px_var(--accent-teal-muted)] glitch-hover group transition-all">
              <Atom className="text-teal-accent group-hover:rotate-180 transition-transform duration-700 ease-in-out" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-accent">VizuLab</h1>
              <p className="text-[10px] text-teal-accent/70 font-mono tracking-[0.2em]">GENERATIVE SIMULATION ENGINE // V.2</p>
            </div>
          </div>
        </div>

        <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:border-teal-accent/30 hover:shadow-[0_0_60px_rgba(0,0,0,0.6)]">
          <SimulationViewer codeString={codeString} />
        </div>
      </div>

      {/* Right Panel: Chat (auto fill rest on mobile, 30% desktop) */}
      <div className="w-full lg:flex-[3] flex flex-col lg:min-w-[350px] min-h-[400px] lg:h-[calc(100vh-2rem)] flex-1 overflow-hidden relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        {showHistory ? (
          <HistoryPanel 
            items={historyItems}
            onSelect={(item) => {
              setCodeString(item.code);
              setShowHistory(false);
            }}
            onClose={() => setShowHistory(false)}
            onClearHistory={async () => {
              setHistoryItems([]);
              if (typeof puter !== 'undefined' && puter.fs) {
                await puter.fs.write('vizulab_history.json', '[]');
              }
            }}
          />
        ) : (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onToggleHistory={() => setShowHistory(true)}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;

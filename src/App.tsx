import { useState } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import type { Message } from './components/ChatInterface';
import { SimulationViewer } from './components/SimulationViewer';
import { generateSimulation } from './lib/llm';
import { Atom } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: "Welcome to VizuLab AI. I can generate any visualization or simulation you describe using the free Gemini API." }
  ]);
  const [codeString, setCodeString] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (input: string) => {
    // Add user message
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Generate simulation
      const code = await generateSimulation(input);

      setCodeString(code);

      // Add system response
      const systemMsg: Message = {
        role: 'system',
        content: `Generated simulation for: "${input}"`
      };
      setMessages(prev => [...prev, systemMsg]);
    } catch (error: any) {
      const errorMsg: Message = { role: 'system', content: `Error: ${error.message || "Failed to generate"}` };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Left Panel: Visualization (70%) */}
      <div className="flex-[7] flex flex-col gap-4 min-h-0">
        <div className="flex items-center justify-between px-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <Atom className="text-indigo-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono tracking-tight text-white">VizuLab</h1>
              <p className="text-xs text-slate-400 font-mono">GENERATIVE SIMULATION ENGINE</p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <SimulationViewer codeString={codeString} />
        </div>
      </div>

      {/* Right Panel: Chat (30%) */}
      <div className="flex-[3] min-w-[350px] flex flex-col min-h-0">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
}

export default App;

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Terminal, Cpu, Trash2, Activity } from "lucide-react";
import MessageBubble from "@/components/messageBubble";
import ToolPanel from "@/components/toolPanel";
import InputBox from "@/components/inputBox";

const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 11);
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<any[]>([]);
  const [toolLogs, setToolLogs] = useState<any[]>([]); 
  const [currentTrace, setCurrentTrace] = useState<any>(null); 
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  const handleRegenerate = () => {
    if (messages.length === 0 || isTyping) return;
    
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMsg) {
      setMessages(prev => prev.slice(0, -1));
      sendMessage(lastUserMsg.content);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setIsTyping(true);
    setCurrentTrace(null); 
    
    const userMsg = { role: "user", content: text };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: updatedHistory }),
      });

      if (!res.ok) throw new Error("Failed to connect to API");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const events = chunk.split("\n\n");

        for (const e of events) {
          if (!e.startsWith("event:")) continue;
          
          const lines = e.split("\n");
          if (lines.length < 2) continue;

          const eventType = lines[0].replace("event: ", "").trim();
          const data = JSON.parse(lines[1].replace("data: ", "").trim());

          if (eventType === "token") {
            assistantText += data;
            setMessages((prev) => {
              const copy = [...prev];
              copy[copy.length - 1].content = assistantText;
              return copy;
            });
          }
          
          if (eventType === "trace") {
            setCurrentTrace(data);
            // 🔹 THE FIX: Force the message bubble to update if it missed tokens
            setMessages((prev) => {
              const copy = [...prev];
              const lastMsg = copy[copy.length - 1];
              if (lastMsg.role === "assistant" && !lastMsg.content) {
                lastMsg.content = data.finalAnswer; 
              }
              return copy;
            });
          }
          
          if (eventType === "tool-end") {
            // Persistent audit log history
            setToolLogs((prev) => [
              ...prev, 
              { ...data, id: generateId(), timestamp: Date.now() }
            ]);
          }

          
        }
      }
    } catch (err) {
      console.error("Stream Error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: Failed to fetch response." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearSession = () => {
    setMessages([]);
    setToolLogs([]);
    setCurrentTrace(null);
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden font-sans">
      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col relative border-r border-zinc-800/50">
        <header className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
           
            <h1 className="text-xs font-bold tracking-widest uppercase">Chat Engine</h1>
          </div>
          <button onClick={clearSession} className="text-zinc-500 hover:text-red-400 transition-colors">
            <Trash2 size={18} />
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Terminal size={48} className="mb-2" />
              <p className="text-xs uppercase tracking-widest">Ready for input</p>
            </div>
          )}
          {messages.map((m, i) => (
  <MessageBubble 
    key={i} 
    role={m.role} 
    content={m.content} 
    isStreaming={isTyping && i === messages.length - 1}
    onRegenerate={i === messages.length - 1 && m.role === "assistant" ? handleRegenerate : undefined}
  />
))}
          {isTyping && (
            <div className="flex items-center gap-2 px-6 text-[10px] text-indigo-400 font-mono animate-pulse">
              <Activity size={12} /> EXECUTING_STREAM...
            </div>
          )}
        </div>

        <div className="p-6">
          <InputBox onSend={sendMessage}  />
        </div>
      </div>

      {/* AUDIT SIDEBAR */}
      <div className="w-[380px] bg-[#0c0c0e] border-l border-zinc-800/50 overflow-hidden flex flex-col">
        <ToolPanel logs={toolLogs} trace={currentTrace} />
      </div>
    </div>
  );
}
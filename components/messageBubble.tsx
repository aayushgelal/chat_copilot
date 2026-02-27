"use client";

import { User, Bot, Copy, RotateCcw, Check } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export default function MessageBubble({ role, content, isStreaming, onRegenerate }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";
  const showLoading = !isUser && isStreaming && !content;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full gap-4 px-4 py-3 group animate-in fade-in slide-in-from-bottom-2 ${
      isUser ? "flex-row-reverse" : "bg-zinc-900/40 rounded-2xl border border-zinc-800/50"
    }`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
        isUser ? "bg-white border-zinc-200" : "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20"
      }`}>
        {isUser ? <User size={18} className="text-zinc-900" /> : <Bot size={18} className="text-white" />}
      </div>

      <div className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {isUser ? "Local Session" : "Assistant"}
          </span>
          {/* Action Buttons: Visible on Hover */}
          {!isUser && content && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleCopy} className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300">
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              </button>
              {onRegenerate && (
                <button onClick={onRegenerate} className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-zinc-300">
                  <RotateCcw size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className={`rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser ? "bg-indigo-600 text-white rounded-tr-none shadow-md" : "text-zinc-200"
        }`}>
          {showLoading ? (
            <div className="flex gap-1 items-center py-1">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : content}
        </div>
      </div>
    </div>
  );
}
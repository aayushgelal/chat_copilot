"use client";

import { Terminal, Activity, Code, Clock, BarChart3 } from "lucide-react";

export default function ToolPanel({ logs, trace }: { logs: any[], trace: any }) {
  return (
    <div className="w-80 h-full border-l border-zinc-800 bg-[#09090b] flex flex-col overflow-hidden">
      {/* 🔹 HEADER */}
      <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
        <Terminal size={16} className="text-zinc-500" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Audit Log</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* 🔹 SECTION: TOOL CALLS */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code size={14} className="text-zinc-600" />
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Tool Executions
            </h3>
          </div>

          {logs.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-zinc-800 rounded-lg">
              <p className="text-[10px] text-zinc-600 uppercase">Awaiting triggers...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...logs].reverse().map((log, i) => (
                <div key={i} className="group p-3 bg-zinc-900/50 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors font-mono text-[11px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-zinc-300 font-bold">/ {log.name}</span>
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                      <Clock size={10} /> {log.durationMs}ms
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 opacity-80">
                    <div className="flex gap-2">
                      <span className="text-zinc-600 shrink-0">INP:</span>
                      <span className="text-zinc-400 break-all">{JSON.stringify(log.input || log.args)}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-zinc-600 shrink-0">OUT:</span>
                      <span className="text-zinc-100 break-all">{JSON.stringify(log.output)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔹 SECTION: TRACE SUMMARY */}
      {trace && (
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={14} className="text-zinc-500" />
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Trace Summary
            </h3>
          </div>
          
          <div className="space-y-2 text-[11px] font-mono">
            <div className="flex justify-between items-center">
              <span className="text-zinc-600">LTCY:</span>
              <span className="text-zinc-300">{trace.totalDurationMs}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-600">TOKN:</span>
              <span className="text-zinc-300">{trace.tokenUsage}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-600">CALLS:</span>
              <span className="text-zinc-300">{trace.toolCalls.length}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-zinc-800/50 flex justify-between items-center">
              <span className="text-zinc-600">STATUS:</span>
              <span className="text-emerald-500 font-bold uppercase text-[9px]">Success</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
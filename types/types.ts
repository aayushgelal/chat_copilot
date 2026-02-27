export type Role = "user" | "assistant" | "tool";

export interface Message {
  id: string;
  role: Role;
  content: string;
}

export interface ToolCallLog {
  name: string;
  input: any;
  output: any;
  durationMs: number;
}

export interface TraceRecord {
    id: string;
    userMessage: string;
    toolCalls: {
      name: string;
      input: any;
      output: any;
      durationMs: number;
    }[];
    finalAnswer: string;
    startTime: number;
    endTime?: number;
    totalDurationMs?: number;
    tokenUsage?: number;
  }
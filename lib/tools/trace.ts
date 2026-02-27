import { v4 as uuid } from "uuid";
import { TraceRecord } from "@/types/types";

export function createTrace(userMessage: string): TraceRecord {
    return {
      id: uuid(),
      userMessage,
      toolCalls: [],
      finalAnswer: "",
      startTime: Date.now()
    };
  }
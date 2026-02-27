import { NextRequest } from "next/server";
import { model } from "@/lib/gemini";
import { runTool } from "@/lib/tools/toolRunner";
import { createTrace } from "@/lib/tools/trace";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;
    const trace = createTrace(userMessage);
    const encoder = new TextEncoder();

    // Reconstruct history for Gemini's specific format
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        const chat = model.startChat({ history });

        try {
          // --- TURN 1: Initial Prompt ---
          const result = await chat.sendMessageStream(userMessage);
          let functionCall: any = null;
          let assistantFullText = "";

          for await (const chunk of result.stream) {
            const parts = chunk.candidates?.[0]?.content?.parts;
            if (!parts) continue;

            for (const part of parts) {
              if (part.functionCall) {
                functionCall = part.functionCall;
              }
              if (part.text) {
                assistantFullText += part.text;
                trace.finalAnswer += part.text;
                sendEvent("token", part.text);
              }
            }
          }

          // --- TURN 2: Tool Execution (The fix is here) ---
          if (functionCall) {
            const start = Date.now();
            const { output } = await runTool(functionCall.name, functionCall.args);
            const durationMs = Date.now() - start;

            const toolPayload = {
              name: functionCall.name,
              input: functionCall.args,
              output,
              durationMs
            };

            trace.toolCalls.push(toolPayload);
            sendEvent("tool-end", toolPayload);

            const finalResult = await chat.sendMessageStream([
              {
                functionResponse: {
                  name: functionCall.name,
                  response: { result: output },
                },
              },
            ]);

            for await (const chunk of finalResult.stream) {
              const parts = chunk.candidates?.[0]?.content?.parts;
              if (!parts) continue;

              for (const part of parts) {
                if (part.text) {
                  trace.finalAnswer += part.text;
                  sendEvent("token", part.text);
                }
              }
            }
          }

          // --- FINALIZE ---
          trace.endTime = Date.now();
          trace.totalDurationMs = trace.endTime - trace.startTime;
          trace.tokenUsage = Math.ceil((trace.finalAnswer.length + userMessage.length) / 4);

          sendEvent("trace", trace);
        } catch (error: any) {
          console.error("Stream error:", error);
          sendEvent("error", { message: error.message });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
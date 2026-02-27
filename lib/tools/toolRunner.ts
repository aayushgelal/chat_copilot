import { local_search, calculator } from "./tools";

const TIMEOUT_MS = 5000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error("Tool execution timed out")), timeoutMs)
    )
  ]);
}

export async function runTool(name: string, args: any, retries = 2): Promise<any> {
  const start = Date.now();
  let attempt = 0;

  while (attempt <= retries) {
    try {
      let output;
      if (name === "local_search") output = await withTimeout(local_search(args.query), TIMEOUT_MS);
      else if (name === "calculator") output = await withTimeout(calculator(args.expression), TIMEOUT_MS);
      else throw new Error("Unknown tool");

      return { output, durationMs: Date.now() - start };
    } catch (error) {
      if (attempt === retries) throw error;
      attempt++;
    }
  }
}
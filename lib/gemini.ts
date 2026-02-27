import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", 
  systemInstruction: "You are a specialized agent. ALWAYS use 'calculator' for math and 'local_search' for any facts. Never answer from memory.",
  tools: [
    {
      functionDeclarations: [
        {
          name: "local_search",
          description: "Search internal docs for company info.",
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              query: { type: SchemaType.STRING, description: "Search query" }
            },
            required: ["query"]
          }
        },
        {
          name: "calculator",
          description: "Solve math expressions.",
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              expression: { type: SchemaType.STRING, description: "The math string" }
            },
            required: ["expression"]
          }
        }
      ]
    }
  ]
});
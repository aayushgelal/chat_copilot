export function detectPromptInjection(message: string): boolean {
  const patterns = [
    /ignore previous instructions/i,
    /system prompt/i,
    /disregard all instructions/i,
    /you are now an/i,
    /new rules/i
  ];
  return patterns.some(pattern => pattern.test(message));
}
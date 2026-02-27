import { tool } from 'ai';
import { z } from 'zod';

export const calculator = tool({
  description: 'A safe calculator for mathematical expressions.',
  parameters: z.object({
    expression: z.string().describe('The math expression to solve (e.g., "5 * 10 + 2")'),
  }),
  execute: async ({ expression }) => {
    // Basic guardrail: only allow numbers and operators
    const sanitized = expression.replace(/[^-()\d/*+.]/g, '');
    try {
      const result = new Function(`return ${sanitized}`)();
      return { result, expression, status: 'success' };
    } catch (error) {
      return { error: 'Invalid expression', status: 'error' };
    }
  },
});
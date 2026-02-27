import { tool } from 'ai';
import { z } from 'zod';
import docs from '../data/docs.json';

export const localSearch = tool({
  description: 'Search through internal company documentation.',
  parameters: z.object({
    query: z.string().describe('The search term'),
  }),
  execute: async ({ query }) => {
    // Simulate latency for the audit log
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const results = docs.filter(doc => 
      doc.content.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      results: results.length > 0 ? results : "No matches found.",
      query,
      timestamp: new Date().toISOString()
    };
  },
});
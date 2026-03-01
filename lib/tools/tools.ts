import { evaluate } from "mathjs";
import dataset from "../data/dataset.json";

export async function local_search(query: string) {
  const tokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const scored = dataset.map((item) => {
    const text = item.content.toLowerCase();
    let score = 0;

    for (const token of tokens) {
      if (text.includes(token)) score++;
    }

    return { ...item, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

export async function calculator(expression: string) {
  return evaluate(expression);
}
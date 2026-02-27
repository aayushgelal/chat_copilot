import { evaluate } from "mathjs";
import dataset from "../data/dataset.json";

export async function local_search(query: string) {
  return dataset.filter((item) =>
    item.content.toLowerCase().includes(query.toLowerCase())
  );
}

export async function calculator(expression: string) {
  return evaluate(expression);
}
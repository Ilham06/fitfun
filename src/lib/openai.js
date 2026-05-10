import OpenAI from "openai";

const globalForOpenAI = globalThis;

export function getOpenAI() {
  if (!globalForOpenAI.openai) {
    globalForOpenAI.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return globalForOpenAI.openai;
}

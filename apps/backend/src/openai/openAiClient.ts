import dotenv from "dotenv";
import { default as OpenAI } from "openai";

dotenv.config();

export const openAiClient = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

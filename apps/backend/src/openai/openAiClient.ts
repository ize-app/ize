import { default as OpenAI } from "openai";

import config from "@/config";

export const openAiClient = new OpenAI({ apiKey: config.OPEN_AI_KEY });

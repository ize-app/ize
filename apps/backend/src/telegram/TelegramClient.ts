import { Telegraf } from "telegraf";

import config from "@/config";

import { ideate, letAiDecide, linkGroup, synthesize } from "./commands";
import { createTelegramWebhook } from "./createTelegramWebhook";
import { handleTelegramFreeTextResponse } from "./handleTelegramFreeTextResponse";
import { handleTelegramPollResponse } from "./handleTelegramPollResponse";

export const telegramBot = new Telegraf(config.TELEGRAM_BOT_TOKEN as string);

createTelegramWebhook();

telegramBot.telegram.setMyCommands([
  { command: "linkgroup", description: "Receive notifications in this chat from Ize" },
  {
    command: "synthesize",
    description:
      "Ask a question for the group to give their opinion about and have AI synthesize all perspectives.",
  },
  {
    command: "ideate",
    description:
      "Ask the group to ideate on a question and have AI summarize all perspectives into a coherent list",
  },
  {
    command: "let_ai_decide",
    description: "Ask the group their opinion and rationale, and have AI decide the best option",
  },
]);

telegramBot.command("linkgroup", async (ctx) => {
  await linkGroup({ ctx });
});

telegramBot.command("synthesize", async (ctx) => {
  await synthesize({ ctx });
});

telegramBot.command("ideate", async (ctx) => {
  await ideate({ ctx });
});

telegramBot.command("let_ai_decide", async (ctx) => {
  await letAiDecide({ ctx });
});

telegramBot.on("poll_answer", (ctx) => {
  handleTelegramPollResponse({ pollAnswer: ctx.update.poll_answer });
});

telegramBot.on("message", async (ctx) => {
  await handleTelegramFreeTextResponse({
    message: ctx.message,
    ctx,
  });
});

// launcing the bot sets up getUpdates polling or webhook by default
// either of which would cause webhook in main process to fail
// console.log("about to launch Telegram Bot. config.CRON", config.CRON);
if (!config.CRON) {
  telegramBot.launch();
}

import dotenv from "dotenv";
import { Telegraf } from "telegraf";

import { ideate, linkGroup, synthesize } from "./commands";
import { handleTelegramFreeTextResponse } from "./handleTelegramFreeTextResponse";
import { handleTelegramPollResponse } from "./handleTelegramPollResponse";

dotenv.config();

const isDev = process.env.MODE === "development";

export const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);

// Telegram requires url have SSL enabled so need to use port forwarding for development
const telegramWebhookDomain = `${isDev ? process.env.PORT_FORWARDING_ADDRESS : process.env.PROD_URL}/api/telegram`;

telegramBot
  .createWebhook({
    domain: telegramWebhookDomain, // Full URL where Telegram will send updates
  })
  .then(() => {
    console.log("Telegram webhook running");
  })
  .catch((err) => {
    console.error("Error setting up webhook:", err);
  });

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

telegramBot.on("poll_answer", (ctx) => {
  handleTelegramPollResponse({ pollAnswer: ctx.update.poll_answer });
});

telegramBot.on("message", async (ctx) => {
  await handleTelegramFreeTextResponse({
    message: ctx.message,
    ctx,
  });
});

telegramBot.launch();

// Enable graceful stop
process.once("SIGINT", () => telegramBot.stop("SIGINT"));
process.once("SIGTERM", () => telegramBot.stop("SIGTERM"));

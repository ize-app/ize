import { Telegraf } from "telegraf";

import config from "@/config";

import { ideate, letAiDecide, linkGroup, synthesize } from "./commands";
import { handleTelegramFreeTextResponse } from "./handleTelegramFreeTextResponse";
import { handleTelegramPollResponse } from "./handleTelegramPollResponse";

export const telegramBot = new Telegraf(config.TELEGRAM_BOT_TOKEN as string);
// will attempt to set up webhook
// if it fails, it falls back to polling
const setupTelegramUpdates = async () => {
  const telegramWebhookDomain = `${config.isDev ? config.PORT_FORWARDING_ADDRESS : config.PROD_URL}`;

  try {
    // throw Error("Not implemented");
    const webhookInfo = await telegramBot.telegram.getWebhookInfo();
    if (!webhookInfo.url || webhookInfo.url !== `${telegramWebhookDomain}/api/telegram`) {
      console.log("Webhook is not set or incorrect. Setting it up...");
      await telegramBot.createWebhook({ domain: telegramWebhookDomain, path: "/api/telegram" });
      console.log("Webhook set successfully:", `${telegramWebhookDomain}/api/telegram`);
    }
  } catch (error) {
    console.error("Failed to set webhook. Falling back to polling:", error);
    console.log("Starting polling...");
    try {
      telegramBot.launch({});
    } catch {
      console.log("Error setting up Telegram polling");
    }
  }
};

// Set up commands and event handlers
const initializeCommandsAndEvents = () => {
  telegramBot.telegram.setMyCommands([
    { command: "linkgroup", description: "Receive notifications in this chat from Ize" },
    {
      command: "synthesize",
      description: "Ask a question and have AI synthesize all perspectives.",
    },
    {
      command: "ideate",
      description: "Ask the group to ideate on a question.",
    },
    {
      command: "let_ai_decide",
      description: "Ask the group and have AI decide the best option.",
    },
  ]);

  telegramBot.command("linkgroup", async (ctx) => {
    console.log("inside linkgroup command");
    await linkGroup({ ctx });
  });

  telegramBot.command("synthesize", async (ctx) => {
    console.log("inside synthesize command");
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
};

// Periodic webhook health check and retry
const startWebhookHealthCheck = () => {
  setInterval(
    async () => {
      try {
        // stop polling before attempting to set a webhook
        telegramBot.stop();
      } catch {
        // if bot isn't polling, it will throw an error but we can ignore that error
      }
      try {
        await setupTelegramUpdates();
      } catch (e) {
        console.error("Error in webhook Telegram healthcheck:", e);
      }
    },
    5 * 60 * 1000,
  ); // Retry every 5 minutes
};

// Initialize the bot
const initializeBot = async () => {
  startWebhookHealthCheck();
  initializeCommandsAndEvents();
  await setupTelegramUpdates();
};

// Start the bot initialization
initializeBot();

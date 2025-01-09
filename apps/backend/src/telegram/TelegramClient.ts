import * as Sentry from "@sentry/node";
import { Telegraf } from "telegraf";

import config from "@/config";
import { FlowConfigGeneration } from "@/core/flow/generateFlowArgs/generateNonreusableFlowConfig/generateNonreusableFlowConfig";

import { handleGenerateFlowCommand, linkGroup } from "./commands";
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
    } catch (error) {
      console.log("Error setting up Telegram polling");
      Sentry.captureException(error, {
        tags: { location: "telegram" },
      });
    }
  }
};

// Set up commands and event handlers
const initializeCommandsAndEvents = () => {
  telegramBot.telegram.setMyCommands([
    { command: "linkgroup", description: "Receive notifications in this chat from Ize" },
    {
      command: "synthesize",
      description: "Create summary of perspectives with AI",
    },
    {
      command: "ideate",
      description: "Summarize list of ideas with AI",
    },
    {
      command: "let_ai_decide",
      description: "Have AI decide the best option.",
    },
    {
      command: "cocreate_poll",
      description: "Cocreate options for a poll.",
    },
  ]);

  telegramBot.command("linkgroup", async (ctx) => {
    await linkGroup({ ctx });
  });

  telegramBot.command("synthesize", async (ctx) => {
    await handleGenerateFlowCommand({ ctx, flowType: FlowConfigGeneration.Synthesize });
  });

  telegramBot.command("ideate", async (ctx) => {
    await handleGenerateFlowCommand({ ctx, flowType: FlowConfigGeneration.Ideate });
  });

  telegramBot.command("let_ai_decide", async (ctx) => {
    await handleGenerateFlowCommand({ ctx, flowType: FlowConfigGeneration.LetAiDecide });
  });

  telegramBot.command("cocreate_poll", async (ctx) => {
    await handleGenerateFlowCommand({ ctx, flowType: FlowConfigGeneration.CocreatePoll });
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
      } catch (error) {
        console.error("Error in webhook Telegram healthcheck:", error);
        Sentry.captureException(error, {
          tags: { location: "telegram" },
        });
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

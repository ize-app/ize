import config from "@/config";

import { telegramBot } from "./TelegramClient";

// webhook that Telegram will send updates to
export const createTelegramWebhook = async () => {
  // Telegram requires url have SSL enabled so need to use port forwarding for development
  const telegramWebhookDomain = `${config.isDev ? config.PORT_FORWARDING_ADDRESS : config.PROD_URL}/api/telegram`;

  const existingWebhook = await telegramBot.telegram.getWebhookInfo();

  // if webhook is already set up, don't set it up again
  // console.log("about to create webhook. config.CRON", config.CRON);
  // console.log("existingWebhook", existingWebhook);
  if (!existingWebhook.url && !config.CRON) {
    console.log("setting webhook");
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
  }
};

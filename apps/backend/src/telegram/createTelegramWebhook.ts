import { telegramBot } from "./TelegramClient";

// webhook that Telegram will send updates to
export const createTelegramWebhook = async () => {
  const isDev = process.env.MODE === "development";
  // Telegram requires url have SSL enabled so need to use port forwarding for development
  const telegramWebhookDomain = `${isDev ? process.env.PORT_FORWARDING_ADDRESS : process.env.PROD_URL}/api/telegram`;

  const existingWebhook = await telegramBot.telegram.getWebhookInfo();

  // if webhook is already set up, don't set it up again
  if (!existingWebhook.url && process.env.CRON === "false") {
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

import dotenv from "dotenv";
import { Telegraf } from "telegraf";

import { upsertIdentityGroup } from "@/core/entity/updateIdentitiesGroups/upsertIdentityGroup";

import { upsertTelegramChatGroup } from "./upsertTelegramChatGroup";
import { upsertTelegramIdentity } from "./upsertTelegramIdentity";

dotenv.config();

const isDev = process.env.MODE === "development";

export const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string, {
  telegram: { testEnv: isDev },
});

// Telegram requires url have SSL enabled so need to use port forwarding for development
const telegramWebhookDomain = `${isDev ? process.env.PORT_FORWARDING_ADDRESS : process.env.PROD_URL}/telegram`;

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
]);

telegramBot.command("linkgroup", async (ctx) => {
  try {
    const chatId = ctx.message.chat.id; // Telegram group chat ID
    const messageThreadId = ctx.message.message_thread_id; // topic thread id
    const fromUserId = ctx.message.from.id; // User's Telegram ID from the group message

    const chat = await ctx.getChat();
    const chatMember = await ctx.telegram.getChatMember(chatId, fromUserId);

    if (chat.type !== "group" && chat.type !== "supergroup") {
      ctx.reply("Invalid chat for Ize bot.");
      return;
    }

    if (chatMember.status !== "administrator" && chatMember.status !== "creator") {
      ctx.reply("You do not have permissions to add the bot to this group.");
      return;
    }

    const tgGroupId = await upsertTelegramChatGroup({
      chatId,
      messageThreadId,
      title: chat.title,
      adminTelegramUserId: fromUserId,
    });

    try {
      const tgIdentity = await upsertTelegramIdentity({ telegramUserData: chatMember.user });
      await upsertIdentityGroup({
        identityId: tgIdentity.id,
        groupId: tgGroupId,
        active: true,
      });
    } catch (error) {
      console.log("ERROR: Telegram bot linkgroup command. Error creating telegram identity", error);
    }

    ctx.reply("Ize will send notifications to this chat");
  } catch (error) {
    console.error("ERROR: Telegram bot linkgroup command ", error);
    ctx.reply("Something went wrong. Please try again.");
  }
});
telegramBot.launch();

// Enable graceful stop
process.once("SIGINT", () => telegramBot.stop("SIGINT"));
process.once("SIGTERM", () => telegramBot.stop("SIGTERM"));

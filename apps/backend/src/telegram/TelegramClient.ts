import dotenv from "dotenv";
import { Telegraf } from "telegraf";

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
  const telegramChatId = ctx.message.chat.id; // Telegram group chat ID
  const userIdToCheck = ctx.message.from.id; // User's Telegram ID from the group message

  const threadId = ctx.message.message_thread_id; // topic thread id
  console.log("telegramChatId", telegramChatId);
  console.log("userIdToCheck", userIdToCheck);
  console.log("threadId", threadId);

  ctx.getChat().then((chat) => {
    if (chat.type === "group" || chat.type === "supergroup") {
      // const title = chat.title;
      // const photo = chat.photo;
    }
  });
  try {
    // Check if the user is a member of the group
    const chatMember = await ctx.telegram.getChatMember(telegramChatId, userIdToCheck);

    console.log("chat member", chatMember);
    if (
      // chatMember.status === "member" ||
      chatMember.status === "administrator" ||
      chatMember.status === "creator"
    ) {
      ctx.reply("Membership confirmed! You are a member of this group.");

      // Now, notify the web app of the confirmation
      //   await fetch("https://yourwebapp.com/api/confirm-telegram-membership", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       telegramUserId: userIdToCheck, // User's Telegram ID
      //       telegramChatId: telegramChatId, // Group's Telegram ID
      //       status: chatMember.status, // Membership status
      //     }),
      //   });
    } else {
      ctx.reply("You are not a member of this group.");
    }
  } catch (error) {
    console.error("Error checking membership:", error);
    ctx.reply("Could not check your membership status.");
  }

  //   ctx.reply("Hello");
});
telegramBot.launch();

// Enable graceful stop
process.once("SIGINT", () => telegramBot.stop("SIGINT"));
process.once("SIGTERM", () => telegramBot.stop("SIGTERM"));

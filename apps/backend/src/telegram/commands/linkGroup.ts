import * as Sentry from "@sentry/node";
import { Message, Update } from "@telegraf/types";
import { Context } from "telegraf";

import { upsertEntityGroup } from "@/core/entity/updateEntitiesGroups/upsertEntityGroup";

import { upsertTelegramChatGroup } from "../upsertTelegramChatGroup";
import { upsertTelegramIdentity } from "../upsertTelegramIdentity";

export const linkGroup = async ({
  ctx,
}: {
  ctx: Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }>;
}) => {
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
      ctx.reply("Only chat admins can change where this bot sends messages.");
      return;
    }

    try {
      const tgIdentity = await upsertTelegramIdentity({ telegramUserData: chatMember.user });

      const tgGroupId = await upsertTelegramChatGroup({
        chatId,
        messageThreadId,
        title: chat.title,
        adminTelegramUserId: fromUserId,
        creatorEntityId: tgIdentity.entityId,
      });

      await upsertEntityGroup({
        entityId: tgIdentity.entityId,
        groupId: tgGroupId,
        active: true,
      });
    } catch (error) {
      console.log("ERROR: Telegram bot linkgroup command. Error creating telegram identity", error);
    }

    ctx.reply("Ize will send notifications to this chat");
  } catch (error) {
    Sentry.captureException(error, {
      tags: { location: "telegram", interaction: "linkGroup" },
    });
    ctx.reply("Something went wrong. Please try again.");
  }
};

import { GroupTelegramChat } from "@prisma/client";

import { WebhookPayload } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

import { createWebhookValueString } from "../createWebhookValueString";

export const sendTelegramResultsNotifications = async ({
  telegramGroups,
  payload,
  requestStepId,
}: {
  telegramGroups: GroupTelegramChat[];
  payload: WebhookPayload;
  requestStepId: string;
}) => {
  if (telegramGroups.length === 0) return;
  const message = `New results in Ize 👀\n\n${payload.requestName} (<i>${payload.flowName}</i>)\n\n${createWebhookValueString(payload.results)}`;
  await Promise.all(
    telegramGroups.map(async (group) => {
      try {
        const messageThreadId = group.messageThreadId ? Number(group.messageThreadId) : undefined;

        const originalMessage = await prisma.telegramMessages.findFirst({
          where: {
            requestStepId: requestStepId,
          },
        });

        await telegramBot.telegram.sendMessage(group.chatId.toString(), message, {
          // reply_markup: {
          //   inline_keyboard: [[{ url, text: "See request on Ize" }]],
          // },

          reply_parameters: originalMessage
            ? {
                message_id: Number(originalMessage.messageId),
              }
            : undefined,
          parse_mode: "HTML",
          message_thread_id: messageThreadId,
        });
        return;
      } catch (e) {
        console.log("sendTelegramResultsNotifications Error", e);
      }
    }),
  );
};

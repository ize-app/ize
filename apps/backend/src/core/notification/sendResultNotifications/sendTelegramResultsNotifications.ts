import { GroupTelegramChat } from "@prisma/client";

import { RequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import { stringifyAction } from "@/core/request/stringify/stringifyAction";
import { stringifyResultGroups } from "@/core/request/stringify/stringifyResultGroups";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

export const sendTelegramResultsNotifications = async ({
  telegramGroups,
  payload,
  requestStepId,
}: {
  telegramGroups: GroupTelegramChat[];
  payload: RequestPayload;
  requestStepId: string;
}) => {
  if (telegramGroups.length === 0) return;
  const message = `New results in Ize 👀\n\n${payload.requestName} (<i>${payload.flowName}</i>)\n\n${stringifyResultGroups({ results: payload.results, type: "html" })}${payload.action ? `\n\nTriggering action: ${stringifyAction({ action: payload.action })}` : ""}`;
  await Promise.all(
    telegramGroups.map(async (group) => {
      try {
        const messageThreadId = group.messageThreadId ? Number(group.messageThreadId) : undefined;

        const originalMessage = await prisma.telegramMessages.findFirst({
          where: {
            requestStepId: requestStepId,
          },
          orderBy: {
            createdAt: "asc",
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

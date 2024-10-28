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

        // only add title string if message won't be on a thread
        const titleString = !originalMessage
          ? `\n\n${payload.requestName} (<i>${payload.flowName}</i>)`
          : "";

        const message = `New results in Ize 👀${titleString}\n\n${stringifyResultGroups({ results: payload.results, type: "html" })}${payload.action ? `\n\n<i>⚡ Triggering action: ${stringifyAction({ action: payload.action })}</i>` : ""}`;

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
          // if message isn't on the thread, we send link to request for context
          reply_markup: !originalMessage
            ? {
                inline_keyboard: [[{ url: payload.requestUrl, text: "See request on Ize" }]],
              }
            : undefined,
        });
        return;
      } catch (e) {
        console.log("sendTelegramResultsNotifications Error", e);
      }
    }),
  );
};

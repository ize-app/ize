import { GroupTelegramChat } from "@prisma/client";

import { createRequestUrl } from "@/core/request/createRequestUrl";
import { Request } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

import { createTelegramResultsString } from "./createResultNotificationString";

export const sendTelegramResultsNotifications = async ({
  telegramGroups,
  request,
  requestStepId,
}: {
  telegramGroups: GroupTelegramChat[];
  request: Request;
  requestStepId: string;
}) => {
  if (telegramGroups.length === 0) return;
  
  const reqStep = request.requestSteps.find((rs) => rs.requestStepId === requestStepId);
  
  if (reqStep?.results.length === 0) return;

  const message = createTelegramResultsString({ request, requestStepId });
  const requestUrl = createRequestUrl({ requestId: request.requestId });
  try {
    // using allSettled so that one message failure doesn't stop other messages from being sent out
    return await Promise.allSettled(
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
            // if message isn't on the thread, we send link to request for context
            reply_markup: !originalMessage
              ? {
                  inline_keyboard: [[{ url: requestUrl, text: "See request on Ize" }]],
                }
              : undefined,
          });
          return;
        } catch (e) {
          console.log(`Error sending notification to Telegram chat ID ${group.chatId}`, e);
          throw e;
        }
      }),
    );
  } catch (e) {
    console.log("sendTelegramResultsNotifications Error", e);
    return;
  }
};

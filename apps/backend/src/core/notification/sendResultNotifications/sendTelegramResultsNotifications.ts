import { GroupTelegramChat } from "@prisma/client";

import { WebhookPayload } from "@/graphql/generated/resolver-types";
import { telegramBot } from "@/telegram/TelegramClient";

const createResultsString = (results: WebhookPayload["results"]) => {
  return results
    .map((result) => {
      if (result.value) {
        return `${result.fieldName}:\n - ${result.value}`;
      } else {
        return `${result.fieldName}:\n ${result.optionSelections?.map((o) => ` - ${o}`).join("\n")}`;
      }
    })
    .join(`\n`);
};

export const sendTelegramResultsNotifications = async ({
  telegramGroups,
  payload,
}: {
  telegramGroups: GroupTelegramChat[];
  payload: WebhookPayload;
}) => {
  if (telegramGroups.length === 0) return;
  const message = `New request in Ize 👀\n${payload.requestName}\n\n__${payload.flowName}__\n${createResultsString(payload.results)}`;
  await Promise.all(
    telegramGroups.map(async (group) => {
      try {
        const messageThreadId = group.messageThreadId ? Number(group.messageThreadId) : undefined;
        await telegramBot.telegram.sendMessage(group.chatId.toString(), message, {
          // reply_markup: {
          //   inline_keyboard: [[{ url, text: "See request on Ize" }]],
          // },
          message_thread_id: messageThreadId,
        });
        return;
      } catch (e) {
        console.log("sendTelegramResultsNotifications Error", e);
      }
    }),
  );
};

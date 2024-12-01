import { GroupTelegramChat } from "@prisma/client";

import { telegramBot } from "@/telegram/TelegramClient";

export const sendDefaultResponseMessage = async ({
  message,
  replyMessageId,
  telegramGroup,
  requestUrl
}: {
  message: string;
  telegramGroup: GroupTelegramChat;
  replyMessageId: number;
  requestUrl: string;
}) => {
  return await telegramBot.telegram.sendMessage(telegramGroup.chatId.toString(), `${message}. Respond <a href="${requestUrl}">here</a>`, {
    message_thread_id: telegramGroup.messageThreadId
      ? Number(telegramGroup.messageThreadId)
      : undefined,
    parse_mode: "HTML",
    reply_parameters: { message_id: replyMessageId },
  });
};

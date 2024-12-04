import { GroupTelegramChat } from "@prisma/client";

import { Field } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

export const sendStringFieldResponseMessage = async ({
  field,
  replyMessageId,
  telegramGroup,
  requestStepId,
}: {
  field: Field;
  telegramGroup: GroupTelegramChat;
  replyMessageId: number;
  requestStepId: string;
}) => {
  const prompt = await telegramBot.telegram.sendMessage(
    telegramGroup.chatId.toString(),
    `<strong>${field.name}</strong>\n\n↩️ Reply to this message to respond`,
    {
      message_thread_id: telegramGroup.messageThreadId
        ? Number(telegramGroup.messageThreadId)
        : undefined,
      parse_mode: "HTML",
      reply_parameters: { message_id: replyMessageId },
    },
  );

  await prisma.telegramMessages.create({
    data: {
      chatId: telegramGroup.chatId,
      messageId: prompt.message_id,
      requestStepId,
      fieldId: field.fieldId,
    },
  });
};

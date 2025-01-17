import { GroupTelegramChat } from "@prisma/client";

import { stringifyValue } from "@/core/request/stringify/stringifyInput";
import { Field, OptionSelectionType, RequestStep } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

export const sendTelegramPoll = async ({
  requestStep,
  field,
  replyMessageId,
  telegramGroup,
}: {
  requestStep: RequestStep;
  field: Field;
  telegramGroup: GroupTelegramChat;
  replyMessageId: number;
}) => {
  if (!field.optionsConfig || field.optionsConfig.selectionType !== OptionSelectionType.Select)
    throw Error("Field is not a select field");

  const options = field.optionsConfig.options.map((option) => stringifyValue(option.value));
  const question = `${field.name}`;
  const poll = await telegramBot.telegram.sendPoll(
    telegramGroup.chatId.toString(),
    question.substring(0, 300),
    options.map((option) => option.substring(0, 100)),
    {
      // anonymous polls don't send poll_answer update
      // to be confirmed: this might just be a testing env issue
      message_thread_id: telegramGroup.messageThreadId
        ? Number(telegramGroup.messageThreadId)
        : undefined,
      is_anonymous: false,
      reply_parameters: { message_id: replyMessageId },
    },
  );

  await prisma.telegramMessages.create({
    data: {
      pollId: BigInt(poll.poll.id),
      chatId: telegramGroup.chatId,
      messageId: poll.message_id,
      requestStepId: requestStep.requestStepId,
      fieldId: field.fieldId,
    },
  });
  return;
};

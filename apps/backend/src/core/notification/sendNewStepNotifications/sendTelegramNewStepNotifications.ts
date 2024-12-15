import { GroupTelegramChat } from "@prisma/client";

import { ResolvedEntities } from "@/core/permission/hasWritePermission/resolveEntitySet";
import { stringifyTriggerFields } from "@/core/request/stringify/stringifyTriggerFields";
import { OptionSelectionType, Request, ValueType } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

import { sendTelegramPoll } from "./sendTelegramPoll";
import { createRequestUrl } from "../../request/createRequestUrl";

export const sendTelegramNewStepMessage = async ({
  telegramGroups,
  request,
  requestStepId,
  permissions,
}: {
  telegramGroups: GroupTelegramChat[];
  request: Request;
  requestStepId: string;
  permissions: {
    anyone: boolean;
    resolvedEntities: ResolvedEntities;
  };
}) => {
  try {
    const requestStep = request.requestSteps.find((step) => step.requestStepId === requestStepId);

    if (!requestStep) throw new Error(`Request step with id ${requestStepId} not found`);

    const baseMessageText = stringifyTriggerFields({
      request,
      title: `Flow Triggered In Ize 👀`,
      subtitle: request.flow.reusable
        ? `[${request.flow.name}] ${request.name}`
        : request.flow.name,
      type: "html",
    });

    const { fieldSet } = requestStep;
    const responseFields = fieldSet.fields.filter((f) => !f.isInternal);
    const firstField = responseFields[0];
    const url = createRequestUrl({ requestId: request.requestId });

    const isValidTelegramPoll =
      firstField.optionsConfig?.selectionType === OptionSelectionType.Select &&
      firstField.optionsConfig?.maxSelections === 1 &&
      firstField.optionsConfig.options.length > 1 &&
      firstField.optionsConfig.options.length <= 11;

    // using allSettled so that one message failure doesn't stop other messages from being sent out

    return await Promise.allSettled(
      telegramGroups.map(async (group) => {
        try {
          const messageThreadId = group.messageThreadId ? Number(group.messageThreadId) : undefined;
          const chatHasRespondPermission =
            permissions.anyone ||
            permissions.resolvedEntities.telegramGroups.some((tg) => tg.id === group.id);
          let fullMessage: string;

          if (responseFields.length === 0) return;
          else if (responseFields.length > 1)
            fullMessage = `${baseMessageText}\n\nThis flow requires a response within Ize`;
          else if (!chatHasRespondPermission)
            fullMessage = `${baseMessageText}\n\nThis flow requires a response within Ize`;
          else if (isValidTelegramPoll)
            fullMessage = `${baseMessageText}\n\nRespond to the poll below`;
          else if (firstField.type === ValueType.String)
            fullMessage = `${baseMessageText}\n\n━━━━━━━━━━━━━━\n\n<strong>Question:</strong> ${firstField.name}\n\n↩️ Reply to this message to respond`;
          else fullMessage = `${baseMessageText}\n\nThis flow requires a response within Ize`;

          // message describing the request
          const message = await telegramBot.telegram.sendMessage(
            group.chatId.toString(),
            fullMessage,
            {
              reply_markup: {
                inline_keyboard: [[{ url, text: "See flow on Ize" }]],
              },
              message_thread_id: messageThreadId,
              parse_mode: "HTML",
            },
          );

          // record of message so we can reply to it later on
          await prisma.telegramMessages.create({
            data: {
              chatId: group.chatId,
              messageId: message.message_id,
              requestStepId,
              fieldId: responseFields.length === 1 ? firstField.fieldId : undefined,
            },
          });

          if (isValidTelegramPoll)
            await sendTelegramPoll({
              field: firstField,
              requestStep,
              telegramGroup: group,
              replyMessageId: message.message_id,
            });
        } catch (e) {
          console.log(
            `Error sending new step notification to Telegram chat Id ${group.chatId} `,
            e,
          );
          throw e;
        }
      }),
    );
  } catch (e) {
    console.log("Error sendTelegramNewStepMessage: ", e);
    return;
  }
};

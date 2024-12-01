import { GroupTelegramChat } from "@prisma/client";

import { ResolvedEntities } from "@/core/permission/hasWritePermission/resolveEntitySet";
import { stringifyTriggerFields } from "@/core/request/stringify/stringifyTriggerFields";
import { OptionSelectionType, Request, ValueType } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

import { sendDefaultResponseMessage } from "./sendDefaultResponseMessage";
import { sendStringFieldResponseMessage } from "./sendStringFieldResponseMessage";
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

    const messageText = stringifyTriggerFields({
      request,
      title: "New request in Ize 👀\n\n<strong>${requestName}</strong> (<i>${flowName}</i>)",
      type: "html",
    });

    const { fieldSet } = requestStep;
    const responseFields = fieldSet.fields.filter((f) => !f.isInternal);
    const firstField = responseFields[0];
    const url = createRequestUrl({ requestId: request.requestId });

    // using allSettled so that one message failure doesn't stop other messages from being sent out

    return await Promise.allSettled(
      telegramGroups.map(async (group) => {
        try {
          const messageThreadId = group.messageThreadId ? Number(group.messageThreadId) : undefined;
          const chatHasRespondPermission =
            permissions.anyone ||
            permissions.resolvedEntities.telegramGroups.some((tg) => tg.id === group.id);

          if (responseFields.length === 0) return;
          0;

          // message describing the request
          const message = await telegramBot.telegram.sendMessage(
            group.chatId.toString(),
            messageText,
            {
              reply_markup: {
                inline_keyboard: [[{ url, text: "See request on Ize" }]],
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
            },
          });

          if (responseFields.length === 0) return;
          else if (!chatHasRespondPermission)
            await sendDefaultResponseMessage({
              message: "The permissions of this request require a response within Ize",
              telegramGroup: group,
              replyMessageId: message.message_id,
              requestUrl: url,
            });
          else if (firstField.optionsConfig?.selectionType === OptionSelectionType.Select)
            await sendTelegramPoll({
              field: firstField,
              requestStep,
              telegramGroup: group,
              replyMessageId: message.message_id,
            });
          else if (firstField.type === ValueType.String)
            await sendStringFieldResponseMessage({
              field: firstField,
              telegramGroup: group,
              replyMessageId: message.message_id,
              requestStepId,
            });
          else
            await sendDefaultResponseMessage({
              message: "This request requires a response within Ize",
              telegramGroup: group,
              replyMessageId: message.message_id,
              requestUrl: url,
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

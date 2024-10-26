import { FieldType, GroupTelegramChat } from "@prisma/client";

import { ResolvedEntities } from "@/core/permission/hasWritePermission/resolveEntitySet";
import { getRequestTriggerFieldAnswers } from "@/core/request/createRequestPayload/getRequestTriggerFieldAnswers";
import { stringifyTriggerFields } from "@/core/request/stringify/stringifyTriggerFields";
import {
  FieldDataType,
  FieldOptionsSelectionType,
  Request,
} from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

import { createRequestUrl } from "../../request/createRequestPayload/createRequestUrl";

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
  const requestStep = request.requestSteps.find((step) => step.requestStepId === requestStepId);

  if (!requestStep) throw new Error(`Request step with id ${requestStepId} not found`);

  const requestName = request.name;
  const flowName = request.flow.name;
  const { fieldSet } = requestStep;
  const responseFields = fieldSet.fields.filter((f) => !f.isInternal);
  const firstField = responseFields[0];
  const url = createRequestUrl({ requestId: request.requestId });

  await Promise.all(
    telegramGroups.map(async (group) => {
      const messageThreadId = group.messageThreadId ? Number(group.messageThreadId) : undefined;
      const chatHasRespondPermission =
        permissions.anyone ||
        permissions.resolvedEntities.telegramGroups.some((tg) => tg.id === group.id);

      if (responseFields.length === 0) return;

      const requestFieldsString = stringifyTriggerFields({
        triggerFields: getRequestTriggerFieldAnswers({ request }),
        type: "html",
      });

      const messageText = `New request in Ize 👀\n\n<strong>${requestName}</strong> (<i>${flowName}</i>)${requestFieldsString.length > 0 ? `\n\n<strong><u>Request details</u></strong>\n${requestFieldsString}` : ""}`;

      const message = await telegramBot.telegram.sendMessage(group.chatId.toString(), messageText, {
        reply_markup: {
          inline_keyboard: [[{ url, text: "See request on Ize" }]],
        },
        message_thread_id: messageThreadId,
        parse_mode: "HTML",
      });

      await prisma.telegramMessages.create({
        data: {
          chatId: group.chatId,
          messageId: message.message_id,
          requestStepId,
        },
      });

      if (responseFields.length > 1 && !chatHasRespondPermission) return;

      if (
        firstField.__typename === FieldType.Options &&
        firstField.selectionType === FieldOptionsSelectionType.Select
      ) {
        const options = firstField.options;
        const question = `${firstField.name}`;
        const poll = await telegramBot.telegram.sendPoll(
          group.chatId.toString(),
          question.substring(0, 300),
          options.map((option) => option.name.substring(0, 100)),
          {
            // anonymous polls don't send poll_answer update
            // to be confirmed: this might just be a testing env issue
            message_thread_id: group.messageThreadId ? Number(group.messageThreadId) : undefined,
            is_anonymous: false,
            close_date: Date.parse(requestStep.expirationDate),
            reply_parameters: { message_id: message.message_id },
          },
        );

        await prisma.telegramMessages.create({
          data: {
            pollId: BigInt(poll.poll.id),
            chatId: group.chatId,
            messageId: poll.message_id,
            requestStepId,
            fieldId: firstField.fieldId,
          },
        });
        return;
      } else if (
        firstField.__typename === FieldType.FreeInput &&
        firstField.dataType === FieldDataType.String
      ) {
        const prompt = await telegramBot.telegram.sendMessage(
          group.chatId.toString(),
          `<strong>${firstField.name}</strong>\n\n↩️ Reply to this message to respond`,
          {
            reply_parameters: { message_id: message.message_id },
            message_thread_id: messageThreadId,

            parse_mode: "HTML",
          },
        );

        await prisma.telegramMessages.create({
          data: {
            chatId: group.chatId,
            messageId: prompt.message_id,
            requestStepId,
            fieldId: firstField.fieldId,
          },
        });
      } else {
        await telegramBot.telegram.sendMessage(
          group.chatId.toString(),
          `<strong>${firstField.name}</strong>\n\n↩️ <a href="${url}">Open this request in Ize to respond</a>`,
          {
            message_thread_id: messageThreadId,
            parse_mode: "HTML",
            reply_parameters: { message_id: message.message_id },
          },
        );
      }
    }),
  );
};

import { FieldType, GroupTelegramChat } from "@prisma/client";

import { ResolvedEntities } from "@/core/permission/hasWritePermission/resolveEntitySet";
import { FieldOptionsSelectionType, Request } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

import { createRequestUrl } from "./createRequestUrl";

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
  const requestStep = request.steps.find((step) => step.requestStepId === requestStepId);

  if (!requestStep) throw new Error(`Request step with id ${requestStepId} not found`);

  const requestName = request.name;
  const flowName = request.flow.name;

  const { responseFields } = requestStep;

  const firstField = responseFields[0];

  const url = createRequestUrl({ requestId: request.requestId });

  await Promise.all(
    telegramGroups.map(async (group) => {
      const messageThreadId = group.messageThreadId ? Number(group.messageThreadId) : undefined;
      const chatHasRespondPermission =
        permissions.anyone ||
        permissions.resolvedEntities.telegramGroups.some((tg) => tg.id === group.id);

      if (responseFields.length === 0) return;

      if (
        chatHasRespondPermission &&
        responseFields.length === 1 &&
        firstField.__typename === FieldType.Options &&
        firstField.selectionType === FieldOptionsSelectionType.Select
      ) {
        const options = firstField.options;
        const poll = await telegramBot.telegram.sendPoll(
          group.chatId.toString(),
          requestName.substring(0, 300),
          options.map((option) => option.name.substring(0, 100)),
          {
            // anonymous polls don't send poll_answer update
            // to be confirmed: this might just be a testing env issue
            message_thread_id: group.messageThreadId ? Number(group.messageThreadId) : undefined,
            is_anonymous: false,
            reply_markup: {
              inline_keyboard: [[{ url, text: "See request on Ize" }]],
            },
          },
        );

        await prisma.telegramPoll.create({
          data: {
            pollId: BigInt(poll.poll.id),
            requestStepId,
            fieldId: firstField.fieldId,
          },
        });
        return;
      } else {
        const message = `New request in Ize 👀\n${requestName}\n\n__${flowName}__`;
        await telegramBot.telegram.sendMessage(group.chatId.toString(), message, {
          reply_markup: {
            inline_keyboard: [[{ url, text: "See request on Ize" }]],
          },
          message_thread_id: messageThreadId,
        });
      }
    }),
  );
};

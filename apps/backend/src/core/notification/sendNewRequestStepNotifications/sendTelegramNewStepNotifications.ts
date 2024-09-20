import { FieldType, GroupTelegramChat } from "@prisma/client";

import { FieldOptionsSelectionType, Request } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

import { createRequestUrl } from "./createRequestUrl";

export const sendTelegramNewStepMessage = async ({
  telegramGroups,
  request,
  requestStepId,
}: {
  telegramGroups: GroupTelegramChat[];
  request: Request;
  requestStepId: string;
}) => {
  const requestStep = request.steps.find((step) => step.requestStepId === requestStepId);
  if (!requestStep) throw new Error(`Request step with id ${requestStepId} not found`);

  const requestName = request.name;

  const { responseFields } = requestStep;

  const firstField = responseFields[0];

  const url = createRequestUrl({ requestId: request.requestId });

  if (
    responseFields.length === 1 &&
    firstField.__typename === FieldType.Options &&
    firstField.selectionType === FieldOptionsSelectionType.Select
  ) {
    const options = firstField.options;
    await Promise.all(
      telegramGroups.map(async (group) => {
        const poll = await telegramBot.telegram.sendPoll(
          group.chatId.toString(),
          requestName.substring(0, 300),
          options.map((option) => option.name.substring(0, 100)),
          {
            // anonymous polls don't send poll_answer update
            // to be confirmed: this might just be a testing env issue
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
      }),
    );
    return;
  }
};

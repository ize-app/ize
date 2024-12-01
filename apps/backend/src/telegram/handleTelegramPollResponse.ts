import { PollAnswer } from "telegraf/types";

import { newResponse } from "@/core/response/newResponse";
import { prisma } from "@/prisma/client";

import { upsertTelegramIdentity } from "./upsertTelegramIdentity";
// import { PollAnswer } from "telegraf/typings/core/types/typegram";
export const handleTelegramPollResponse = async ({ pollAnswer }: { pollAnswer: PollAnswer }) => {
  const pollId = pollAnswer.poll_id;
  const telegramUserData = pollAnswer.user;
  const selectedOptions = pollAnswer.option_ids;

  const poll = await prisma.telegramMessages.findFirstOrThrow({
    where: {
      pollId: BigInt(pollId),
    },
  });

  if (!poll.fieldId) return;

  if (!telegramUserData) return;

  const identity = await upsertTelegramIdentity({ telegramUserData: telegramUserData });

  await newResponse({
    entityContext: { type: "identity", identity },
    args: {
      response: {
        responseId: crypto.randomUUID(),
        answers: [
          {
            fieldId: poll.fieldId,
            optionSelections: selectedOptions.map((o) => ({ optionIndex: o, weight: 1 })),
          },
        ],
        requestStepId: poll.requestStepId,
      },
    },
  });
};

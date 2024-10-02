import { PollAnswer } from "telegraf/types";

import { identityInclude } from "@/core/entity/identity/identityPrismaTypes";
import { newResponse } from "@/core/response/newResponse";
import { prisma } from "@/prisma/client";
// import { PollAnswer } from "telegraf/typings/core/types/typegram";
export const handleTelegramPollResponse = async ({ pollAnswer }: { pollAnswer: PollAnswer }) => {
  const pollId = pollAnswer.poll_id;
  const userId = pollAnswer.user?.id;
  const selectedOptions = pollAnswer.option_ids;

  const poll = await prisma.telegramMessages.findFirstOrThrow({
    where: {
      pollId: BigInt(pollId),
    },
  });

  const identity = await prisma.identity.findFirstOrThrow({
    include: identityInclude,
    where: {
      IdentityTelegram: {
        telegramUserId: userId,
      },
    },
  });

  await newResponse({
    type: "identity",
    args: {
      response: {
        answers: [
          {
            fieldId: poll.fieldId,
            optionSelections: selectedOptions.map((o) => ({ optionIndex: o })),
          },
        ],
        requestStepId: poll.requestStepId,
      },
    },
    identity,
  });
};

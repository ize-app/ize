import { PollAnswer } from "telegraf/types";

import { newResponse } from "@/core/response/newResponse";
import { meInclude } from "@/core/user/userPrismaTypes";
import { prisma } from "@/prisma/client";
// import { PollAnswer } from "telegraf/typings/core/types/typegram";
export const handleTelegramPollResponse = async ({ pollAnswer }: { pollAnswer: PollAnswer }) => {
  const pollId = pollAnswer.poll_id;
  const userId = pollAnswer.user?.id;
  const selectedOptions = pollAnswer.option_ids;

  const poll = await prisma.telegramPoll.findFirstOrThrow({
    where: {
      pollId: BigInt(pollId),
    },
  });

  const user = await prisma.user.findFirstOrThrow({
    include: meInclude,
    where: {
      Identities: {
        some: {
          IdentityTelegram: {
            telegramUserId: userId,
          },
        },
      },
    },
  });

  await newResponse({
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
    context: { currentUser: user },
  });
};

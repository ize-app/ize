import { prisma } from "@/prisma/client";

import { telegramBot } from "./TelegramClient";

// end all polls for a given request step
/* eslint-disable */
export const endTelegramPolls = async ({ requestStepId }: { requestStepId: string }) => {
  try {
    const polls = await prisma.telegramMessages.findMany({
      where: {
        requestStepId,
        pollId: { not: null },
      },
    });
    await Promise.all(
      polls.map(async (poll) => {
        telegramBot.telegram.stopPoll(Number(poll.chatId), Number(poll.messageId));
      }),
    );
  } catch (e) {
    console.log("Error endTelegramPolls: ", e);
  }
};
/* eslint-enable */

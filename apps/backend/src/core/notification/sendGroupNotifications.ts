import { localUrl, prodUrl } from "@/express/origins";
import { User } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

import { createNotificationPayload } from "./createNotificationPayload";
import { entityInclude } from "../entity/entityPrismaTypes";
// import { callWebhook } from "../action/webhook/callWebhook";

export const sendGroupNotifications = async ({
  flowId,
  requestId,
  flowTitle,
  requestTitle,
  stepIndex,
  creator,
}: {
  flowId: string;
  requestId: string;
  flowTitle: string;
  requestTitle: string;
  stepIndex: number;
  creator: User;
}): Promise<void> => {
  try {
    const isDev = process.env.MODE === "development";
    const baseIzeUrl = isDev ? localUrl : prodUrl;
    // get groups that watch or own flow AND have notifications set up

    const groups = await prisma.group.findMany({
      include: {
        GroupCustom: {
          include: {
            NotificationEntity: {
              include: entityInclude,
            },
          },
        },
      },
      where: {
        OR: [
          { OwnedFlows: { some: { id: flowId } } },
          {
            GroupsWatchedFlows: {
              some: {
                flowId,
                watched: true,
              },
            },
          },
        ],
        GroupCustom: {
          notificationEntityId: { not: null },
        },
      },
    });

    const payload = createNotificationPayload({
      requestId,
      requestTitle: stepIndex > 0 ? `${requestTitle} (Step ${stepIndex + 1})` : requestTitle,
      flowTitle,
      creatorName: creator.name,
      baseIzeUrl,
    });

    await Promise.all(
      groups.map(async (group) => {
        const telegramGroupChat = group.GroupCustom?.NotificationEntity?.Group?.GroupTelegramChat;
        if (!telegramGroupChat) return;

        telegramBot.telegram.sendMessage(telegramGroupChat.chatId.toString(), payload.message);
      }),
    );
  } catch (e) {
    // error sending group notifications shouldn't stop the request from being written
    console.log("Error sending group notifications: ", e);
  }
};

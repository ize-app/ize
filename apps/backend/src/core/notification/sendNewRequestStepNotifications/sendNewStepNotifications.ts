import { requestInclude } from "@/core/request/requestPrismaTypes";
import { requestResolver } from "@/core/request/resolvers/requestResolver";
import { prisma } from "@/prisma/client";

import { sendTelegramNewStepMessage } from "./sendTelegramNewStepNotifications";
import { entityInclude } from "../../entity/entityPrismaTypes";

export const sendNewStepNotifications = async ({
  flowId,
  requestStepId,
}: {
  flowId: string;
  requestStepId: string;
}): Promise<void> => {
  try {
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

    if (groups.length === 0) {
      return;
    }

    const data = await prisma.request.findFirstOrThrow({
      where: { RequestSteps: { some: { id: requestStepId } } },
      include: requestInclude,
    });

    const request = await requestResolver({ req: data, context: {}, userGroupIds: [] });

    const telegramGroups = groups
      .map((group) => group.GroupCustom?.NotificationEntity?.Group?.GroupTelegramChat)
      .filter((tgGroup) => !!tgGroup);

    await sendTelegramNewStepMessage({ telegramGroups, request, requestStepId });
  } catch (e) {
    // error sending group notifications shouldn't stop the request from being written
    console.log("Error sending group notifications: ", e);
  }
};

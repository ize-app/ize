import { prisma } from "@/prisma/client";

import { entityInclude } from "../entity/entityPrismaTypes";

export const getGroupsToNotify = async (flowId: string) => {
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

  return groups;
};

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
        // flow is either owned by group OR evolves flow that group owns
        {
          OwnedFlows: {
            some: { OR: [{ id: flowId }, { CurrentFlowVersion: { evolveFlowId: flowId } }] },
          },
        },
        // flow is either watched by group or evolves flow that group watches
        {
          GroupsWatchedFlows: {
            some: {
              OR: [{ flowId }, { Flow: { CurrentFlowVersion: { evolveFlowId: flowId } } }],
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

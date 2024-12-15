import { Prisma } from "@prisma/client";

import { FlowWatchFilter } from "@/graphql/generated/resolver-types";

import { createFlowWatchFilter } from "../flow/flowPrismaFilters";

export const createRequestWatchFilter = ({
  flowWatchFilter,
  userEntityIds,
}: {
  flowWatchFilter: FlowWatchFilter;
  userEntityIds: string[];
}): Prisma.RequestWhereInput => {
  const userCreatedRequestOrResponded: Prisma.RequestWhereInput = {
    OR: [
      { creatorEntityId: { in: userEntityIds } },
      {
        RequestSteps: {
          some: {
            Responses: {
              some: {
                creatorEntityId: { in: userEntityIds },
              },
            },
          },
        },
      },
    ],
  };

  // get requests for flows that are watched or for evolve requests for flows they watch
  const flowWatchedFilter: Prisma.RequestWhereInput = {
    OR: [
      {
        FlowVersion: {
          Flow: createFlowWatchFilter({ flowWatchFilter, userEntityIds }),
        },
      },
      {
        ProposedFlowVersionEvolution: {
          Flow: createFlowWatchFilter({ flowWatchFilter, userEntityIds }),
        },
      },
    ],
  };

  switch (flowWatchFilter) {
    case FlowWatchFilter.WatchedByMeOrMyGroups:
      return {
        OR: [userCreatedRequestOrResponded, flowWatchedFilter],
      };
    case FlowWatchFilter.WatchedByMe:
      return {
        OR: [userCreatedRequestOrResponded, flowWatchedFilter],
      };
    case FlowWatchFilter.NotWatching:
      return flowWatchedFilter;
    default:
      return {};
  }
};

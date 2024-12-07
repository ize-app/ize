import { Prisma } from "@prisma/client";

import { FlowWatchFilter } from "@/graphql/generated/resolver-types";

import { actionConfigInclude } from "../action/actionPrismaTypes";
import { entityInclude } from "../entity/entityPrismaTypes";
import { groupInclude } from "../entity/group/groupPrismaTypes";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { createPermissionFilter, permissionInclude } from "../permission/permissionPrismaTypes";
import { responseConfigInclude } from "../response/responseConfigPrismaTypes";
import { resultConfigSetInclude } from "../result/resultPrismaTypes";

export const stepInclude = Prisma.validator<Prisma.StepInclude>()({
  ResponseConfig: {
    include: responseConfigInclude,
  },
  ResponseFieldSet: {
    include: fieldSetInclude,
  },
  ResultConfigSet: {
    include: resultConfigSetInclude,
  },
  ActionConfigSet: {
    include: {
      ActionConfigs: {
        include: actionConfigInclude,
      },
    },
  },
});

export type StepPrismaType = Prisma.StepGetPayload<{
  include: typeof stepInclude;
}>;

export const entityWatchedFlowsInclude = Prisma.validator<Prisma.EntityWatchedFlowsInclude>()({
  Entity: {
    include: entityInclude,
  },
});

export type EntityWatchedFlowsPrismaType = Prisma.EntityWatchedFlowsGetPayload<{
  include: typeof entityWatchedFlowsInclude;
}>;

export const createFlowVersionInclude = (userEntityIds: string[]) =>
  Prisma.validator<Prisma.FlowVersionInclude>()({
    TriggerFieldSet: {
      include: fieldSetInclude,
    },
    TriggerPermissions: {
      include: permissionInclude,
    },
    Steps: {
      include: stepInclude,
    },
    Flow: {
      // if evolve flow, this will be array of all flow versions managed by that evolveflow
      include: {
        EvolveRightsForFlowVersions: {
          include: {
            Flow: true,
          },
        },
        OwnerGroup: {
          include: groupInclude,
        },
        EntityWatchedFlows: {
          include: entityWatchedFlowsInclude,
          where: {
            OR: [
              { entityId: { in: userEntityIds } },
              { Entity: { Group: { GroupIze: { NOT: undefined } } } },
            ],
          },
        },
      },
    },
  });

const flowVersionExampleInclude = createFlowVersionInclude([]);

export type FlowVersionPrismaType = Prisma.FlowVersionGetPayload<{
  include: typeof flowVersionExampleInclude;
}>;

export const createFlowInclude = (entityIds: string[]) =>
  Prisma.validator<Prisma.FlowInclude>()({
    CurrentFlowVersion: {
      include: createFlowVersionInclude(entityIds),
    },
  });

const flowExampleInclude = Prisma.validator<Prisma.FlowInclude>()({
  CurrentFlowVersion: {
    include: flowVersionExampleInclude,
  },
});

export type FlowPrismaType = Prisma.FlowGetPayload<{
  include: typeof flowExampleInclude;
}>;

export const createFlowWatchFilter = ({
  flowWatchFilter,
  userEntityIds,
}: {
  flowWatchFilter: FlowWatchFilter;
  userEntityIds: string[];
}): Prisma.FlowWhereInput => {
  const watchedByMe = createUserWatchedFlowFilter({ userEntityIds });
  const watchedByMyGroups = createUserGroupsWatchedFlowsFilter({ userEntityIds });

  switch (flowWatchFilter) {
    case FlowWatchFilter.WatchedByMeOrMyGroups:
      return { OR: [watchedByMe, watchedByMyGroups] };
    case FlowWatchFilter.WatchedByMe:
      return watchedByMe;
    case FlowWatchFilter.NotWatching:
      return { NOT: [watchedByMe, watchedByMyGroups] };
    default:
      return {};
  }
};

// used for getting flows that a user is watching as well as request steps from flows they are watching
export const createUserWatchedFlowFilter = ({ userEntityIds }: { userEntityIds: string[] }) => {
  // flows watched directly by user OR
  const userWatchedQuery: Prisma.FlowWhereInput = {
    EntityWatchedFlows: {
      some: {
        entityId: { in: userEntityIds },
        watched: true,
      },
    },
  };

  return userWatchedQuery;
};

export const createFlowPermissionFilter = (
  groupIds: string[],
  identityIds: string[],
  userId: string | undefined,
): Prisma.FlowVersionWhereInput => ({
  TriggerPermissions: createPermissionFilter({ groupIds, identityIds, userId }),
});

export const createUserGroupsWatchedFlowsFilter = ({
  userEntityIds,
}: {
  userEntityIds: string[];
}) => {
  const userGroupsWatchedQuery: Prisma.FlowWhereInput = {
    EntityWatchedFlows: {
      some: {
        Entity: {
          Group: {
            EntityWatchedGroups: {
              some: { entityId: { in: userEntityIds }, watched: true },
            },
          },
        },
      },
    },
  };
  return userGroupsWatchedQuery;
};

export const createGroupWatchedFlowFilter = ({
  groupId,
  watched,
  excudeOwnedFlows = false,
}: {
  groupId: string;
  watched: boolean;
  excudeOwnedFlows?: boolean;
}) => {
  if (watched)
    return Prisma.validator<Prisma.FlowWhereInput>()({
      OR: [
        !excudeOwnedFlows ? { OwnerGroup: { id: groupId } } : {},
        {
          EntityWatchedFlows: {
            some: {
              Entity: {
                Group: {
                  id: groupId,
                },
              },
            },
          },
        },
      ],
    });
  else
    return Prisma.validator<Prisma.FlowWhereInput>()({
      NOT: {
        EntityWatchedFlows: {
          some: {
            Entity: {
              Group: {
                id: groupId,
              },
            },
          },
        },
      },
    });
};

export const createFlowSummaryInclude = (userEntityIds: string[]) =>
  Prisma.validator<Prisma.FlowInclude>()({
    CurrentFlowVersion: {
      include: {
        TriggerPermissions: {
          include: permissionInclude,
        },
      },
    },
    CreatorEntity: {
      include: entityInclude,
    },
    OwnerGroup: {
      include: {
        ...groupInclude,
        EntityWatchedGroups: {
          where: {
            entityId: { in: userEntityIds },
            watched: true,
          },
        },
      },
    },
    EntityWatchedFlows: {
      include: entityWatchedFlowsInclude,
      where: {
        OR: [
          { entityId: { in: userEntityIds } },
          { Entity: { Group: { GroupIze: { NOT: undefined } } } },
        ],
      },
    },
  });

export const flowSummaryExampleInclude = createFlowSummaryInclude([]);

export type FlowSummaryPrismaType = Prisma.FlowGetPayload<{
  include: typeof flowSummaryExampleInclude;
}>;

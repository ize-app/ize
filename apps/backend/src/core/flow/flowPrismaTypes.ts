import { Prisma } from "@prisma/client";

import { actionInclude } from "../action/actionPrismaTypes";
import { entityInclude } from "../entity/entityPrismaTypes";
import { groupInclude } from "../entity/group/groupPrismaTypes";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { permissionInclude } from "../permission/permissionPrismaTypes";
import { responseConfigInclude } from "../response/responseConfigPrismaTypes";
import { resultConfigSetInclude } from "../result/resultPrismaTypes";

export const stepInclude = Prisma.validator<Prisma.StepInclude>()({
  ResponseConfig: {
    include: responseConfigInclude,
  },
  FieldSet: {
    include: fieldSetInclude,
  },
  ResultConfigSet: {
    include: resultConfigSetInclude,
  },
  Action: {
    include: actionInclude,
  },
});

export type StepPrismaType = Prisma.StepGetPayload<{
  include: typeof stepInclude;
}>;

export const createFlowVersionInclude = (entityIds: string[]) =>
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
          include: {
            ...groupInclude,
            EntityWatchedGroups: {
              where: {
                entityId: { in: entityIds },
                watched: true,
              },
            },
          },
        },
        GroupsWatchedFlows: {
          where: {
            Group: {
              EntityWatchedGroups: {
                some: {
                  entityId: { in: entityIds },
                  watched: true,
                },
              },
            },
          },
        },
        EntityWatchedFlows: {
          where: {
            entityId: { in: entityIds },
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
// used for getting flows that a user is watching as well as request steps from flows they are watching
export const createUserWatchedFlowFilter = ({
  entityIds,
  watched,
}: {
  entityIds: string[];
  watched: boolean;
}) => {
  const groupWatchQuery: Prisma.FlowWhereInput = {
    // user is not watching flow and...
    EntityWatchedFlows: {
      none: {
        entityId: { in: entityIds },
        watched: false,
      },
    },
    // owned by a group that the user is watching
    OR: [
      {
        OwnerGroup: {
          EntityWatchedGroups: {
            some: {
              entityId: { in: entityIds },
              watched: true,
            },
          },
        },
      },
      // flow is watched by group that user is watching
      {
        GroupsWatchedFlows: {
          some: {
            Group: {
              EntityWatchedGroups: {
                some: {
                  entityId: { in: entityIds },
                  watched: true,
                },
              },
            },
          }, // TODO switch out for watched groups
        },
      },
    ],
  };

  const userWatchQuery: Prisma.FlowWhereInput = {
    EntityWatchedFlows: {
      some: {
        entityId: { in: entityIds },
        watched: true,
      },
    },
  };

  // flow is watched if either
  // 1) user is watching that flow
  // 2) The user did not unwatch that flow that they are watching
  //    a group that is watching that flow
  return Prisma.validator<Prisma.FlowWhereInput>()({
    [watched ? "OR" : "NOT"]: [userWatchQuery, groupWatchQuery],
  });
};

export const createGroupWatchedFlowFilter = ({
  groupId,
  watched,
  excudeOwnedFlows = false,
}: {
  groupId: string;
  watched: boolean;
  excudeOwnedFlows?: boolean;
}) =>
  Prisma.validator<Prisma.FlowWhereInput>()({
    [watched ? "OR" : "NOT"]: [
      !excudeOwnedFlows ? { OwnerGroup: { id: groupId } } : {},
      { GroupsWatchedFlows: { some: { groupId: groupId, watched: true } } },
    ],
  });

export const createFlowSummaryInclude = (entityIds: string[]) =>
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
            entityId: { in: entityIds },
            watched: true,
          },
        },
      },
    },
    GroupsWatchedFlows: {
      where: {
        Group: {
          EntityWatchedGroups: {
            some: {
              entityId: { in: entityIds },
              watched: true,
            },
          },
        },
      },
    },

    EntityWatchedFlows: {
      where: {
        entityId: { in: entityIds },
      },
    },
  });

export const flowSummaryExampleInclude = createFlowSummaryInclude([]);

// export const flowSummaryExampleInclude = Prisma.validator<Prisma.FlowInclude>()({
// CurrentFlowVersion: {
//   include: {
//     Steps: {
//       include: {
//         RequestPermissions: {
//           include: permissionInclude,
//         },
//       },
//     },
//   },
// },
// Creator: {
//   include: userInclude,
// },
// OwnerGroup: {
//   include: groupInclude,
// },
// });

export type FlowSummaryPrismaType = Prisma.FlowGetPayload<{
  include: typeof flowSummaryExampleInclude;
}>;

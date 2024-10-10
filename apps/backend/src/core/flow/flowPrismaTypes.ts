import { Prisma } from "@prisma/client";

import { actionInclude } from "../action/actionPrismaTypes";
import { entityInclude } from "../entity/entityPrismaTypes";
import { groupInclude } from "../entity/group/groupPrismaTypes";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { permissionInclude } from "../permission/permissionPrismaTypes";
import { resultConfigSetInclude } from "../result/resultPrismaTypes";
import { UserPrismaType } from "../user/userPrismaTypes";

export const stepInclude = Prisma.validator<Prisma.StepInclude>()({
  RequestPermissions: {
    include: permissionInclude,
  },
  ResponsePermissions: {
    include: permissionInclude,
  },
  RequestFieldSet: {
    include: fieldSetInclude,
  },
  ResponseFieldSet: {
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

export const createFlowVersionInclude = (user: UserPrismaType | undefined | null) =>
  Prisma.validator<Prisma.FlowVersionInclude>()({
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
            UsersWatchedGroups: {
              where: {
                userId: user?.id,
                watched: true,
              },
            },
          },
        },
        GroupsWatchedFlows: {
          where: {
            Group: {
              UsersWatchedGroups: {
                some: {
                  userId: user?.id,
                  watched: true,
                },
              },
            },
          },
        },
        EntityWatchedFlows: {
          where: {
            entityId: user?.entityId,
          },
        },
      },
    },
  });

const flowVersionExampleInclude = createFlowVersionInclude(undefined);

export type FlowVersionPrismaType = Prisma.FlowVersionGetPayload<{
  include: typeof flowVersionExampleInclude;
}>;

export const createFlowInclude = (user: UserPrismaType | undefined | null) =>
  Prisma.validator<Prisma.FlowInclude>()({
    CurrentFlowVersion: {
      include: createFlowVersionInclude(user),
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
  user,
  watched,
}: {
  user: UserPrismaType;
  watched: boolean;
}) => {
  const groupWatchQuery: Prisma.FlowWhereInput = {
    // user is not watching flow and...
    EntityWatchedFlows: {
      none: {
        entityId: user?.entityId,
        watched: false,
      },
    },
    // owned by a group that the user is watching
    OR: [
      {
        OwnerGroup: {
          UsersWatchedGroups: {
            some: {
              userId: user?.id,
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
              UsersWatchedGroups: {
                some: {
                  userId: user?.id,
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
        entityId: user?.entityId,
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

export const createGroupWatchedFlowFilter = ({ groupId }: { groupId: string }) =>
  Prisma.validator<Prisma.FlowWhereInput>()({
    OR: [
      { OwnerGroup: { id: groupId } },
      { GroupsWatchedFlows: { some: { groupId: groupId, watched: true } } },
    ],
  });

export const createFlowSummaryInclude = (user: UserPrismaType | undefined | null) =>
  Prisma.validator<Prisma.FlowInclude>()({
    CurrentFlowVersion: {
      include: {
        Steps: {
          include: {
            RequestPermissions: {
              include: permissionInclude,
            },
          },
        },
      },
    },
    CreatorEntity: {
      include: entityInclude,
    },
    OwnerGroup: {
      include: {
        ...groupInclude,
        UsersWatchedGroups: {
          where: {
            userId: user?.id,
            watched: true,
          },
        },
      },
    },
    GroupsWatchedFlows: {
      where: {
        Group: {
          UsersWatchedGroups: {
            some: {
              userId: user?.id,
              watched: true,
            },
          },
        },
      },
    },

    EntityWatchedFlows: {
      where: {
        entityId: user?.entityId,
      },
    },
  });

export const flowSummaryExampleInclude = createFlowSummaryInclude(undefined);

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

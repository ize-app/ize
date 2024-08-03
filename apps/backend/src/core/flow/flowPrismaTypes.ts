import { Prisma } from "@prisma/client";

import { actionInclude } from "../action/actionPrismaTypes";
import { groupInclude } from "../entity/group/groupPrismaTypes";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { permissionInclude } from "../permission/permissionPrismaTypes";
import { resultConfigSetInclude } from "../result/resultPrismaTypes";
import { userInclude } from "../user/userPrismaTypes";

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

export const createFlowVersionInclude = (userId: string | undefined) =>
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
                userId: userId,
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
                  userId: userId,
                  watched: true,
                },
              },
            },
          },
        },

        UsersWatchedFlows: {
          where: {
            userId: userId,
          },
        },
      },
    },
  });

const flowVersionExampleInclude = createFlowVersionInclude("userId");

export type FlowVersionPrismaType = Prisma.FlowVersionGetPayload<{
  include: typeof flowVersionExampleInclude;
}>;

export const createFlowInclude = (userId: string | undefined) =>
  Prisma.validator<Prisma.FlowInclude>()({
    CurrentFlowVersion: {
      include: createFlowVersionInclude(userId),
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
  userId,
  watched,
}: {
  userId: string;
  watched: boolean;
}) =>
  Prisma.validator<Prisma.FlowWhereInput>()({
    [watched ? "OR" : "NOT"]: [
      // flow is watched if either
      // 1) user is watching that flow
      // 2) The user did not unwatch that flow that they are watching
      //    a group that is watching that flow
      {
        UsersWatchedFlows: {
          some: {
            userId: userId,
            watched: true,
          },
        },
      },
      {
        UsersWatchedFlows: {
          none: {
            userId: userId,
            watched: false,
          },
        },
        OR: [
          {
            OwnerGroup: {
              UsersWatchedGroups: {
                some: {
                  userId: userId,
                  watched: true,
                },
              },
            },
          },
          {
            GroupsWatchedFlows: {
              some: {
                Group: {
                  UsersWatchedGroups: {
                    some: {
                      userId: userId,
                      watched: true,
                    },
                  },
                },
              }, // TODO switch out for watched groups
            },
          },
        ],
      },
    ],
  });

export const createGroupWatchedFlowFilter = ({ groupId }: { groupId: string }) =>
  Prisma.validator<Prisma.FlowWhereInput>()({
    OR: [{ OwnerGroup: { id: groupId } }, { GroupsWatchedFlows: { some: { groupId: groupId } } }],
  });

export const createFlowSummaryInclude = (userId: string | undefined) =>
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
    Creator: {
      include: userInclude,
    },
    OwnerGroup: {
      include: {
        ...groupInclude,
        UsersWatchedGroups: {
          where: {
            userId: userId,
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
              userId: userId,
              watched: true,
            },
          },
        },
      },
    },

    UsersWatchedFlows: {
      where: {
        userId: userId,
      },
    },
  });

export const flowSummaryExampleInclude = createFlowSummaryInclude("userId");

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

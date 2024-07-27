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

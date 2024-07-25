import { Prisma } from "@prisma/client";

import { actionInclude } from "../action/actionPrismaTypes";
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

export const flowVersionInclude = Prisma.validator<Prisma.FlowVersionInclude>()({
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
          GroupCustom: true,
        },
      },
    },
  },
});

export type FlowVersionPrismaType = Prisma.FlowVersionGetPayload<{
  include: typeof flowVersionInclude;
}>;

export const flowInclude = Prisma.validator<Prisma.FlowInclude>()({
  CurrentFlowVersion: {
    include: flowVersionInclude,
  },
});

export type FlowPrismaType = Prisma.FlowGetPayload<{
  include: typeof flowInclude;
}>;

export const flowSummaryInclude = Prisma.validator<Prisma.FlowInclude>()({
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
      GroupCustom: true,
    },
  },
});

export type FlowSummaryPrismaType = Prisma.FlowGetPayload<{ include: typeof flowSummaryInclude }>;

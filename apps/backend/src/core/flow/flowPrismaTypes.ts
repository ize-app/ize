import { Prisma } from "@prisma/client";
import { permissionInclude } from "../permission/permissionPrismaTypes";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { actionInclude } from "../action/actionPrismaTypes";
import { resultConfigSetInclude } from "../result/resultPrismaTypes";
import { userInclude } from "../user/formatUser";

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
  Flow: true,
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
            include: {
              EntitySet: {
                include: {
                  EntitySetEntities: {
                    include: { Entity: { include: { Group: true, Identity: true } } },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  Creator: {
    include: userInclude,
  },
});

export type FlowSummaryPrismaType = Prisma.FlowGetPayload<{ include: typeof flowSummaryInclude }>;

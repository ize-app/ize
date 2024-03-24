import { Prisma } from "@prisma/client";
import { permissionInclude } from "../permission/types";
import { fieldSetInclude } from "../fields/fieldPrismaTypes";
import { actionInclude } from "../action/actionPrismaTypes";
import { resultConfigSetInclude } from "../result/types";

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
  ActionNew: {
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

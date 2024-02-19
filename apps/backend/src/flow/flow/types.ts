import { Prisma } from "@prisma/client";
import { permissionInclude } from "../permission/types";
import { fieldSetInclude } from "../fields/types";
import { actionInclude } from "../action/types";
import { resultConfigInclude } from "../result/types";

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
  ResultConfig: {
    include: resultConfigInclude,
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

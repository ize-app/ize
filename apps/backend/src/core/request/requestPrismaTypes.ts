import { Prisma } from "@prisma/client";
import { flowVersionInclude } from "../flow/flowPrismaTypes";
import { fieldAnswerInclude, fieldOptionSetInclude } from "../fields/fieldPrismaTypes";

export const requestDefinedOptionSetInclude =
  Prisma.validator<Prisma.RequestDefinedOptionSetInclude>()({
    FieldOptionSet: {
      include: fieldOptionSetInclude,
    },
  });

export type RequestDefinedOptionSetPrismaType = Prisma.RequestDefinedOptionSetGetPayload<{
  include: typeof requestDefinedOptionSetInclude;
}>;

export const requestStepInclude = Prisma.validator<Prisma.RequestStepInclude>()({
  RequestFieldAnswers: {
    include: fieldAnswerInclude,
  },
  RequestDefinedOptionSets: {
    include: {
      FieldOptionSet: {
        include: fieldOptionSetInclude,
      },
    },
  },
});

export type RequestStepPrismaType = Prisma.RequestStepGetPayload<{
  include: typeof requestStepInclude;
}>;

export const requestInclude = Prisma.validator<Prisma.RequestNewInclude>()({
  RequestSteps: {
    include: requestStepInclude,
  },
  Creator: true,
  FlowVersion: {
    include: flowVersionInclude,
  },
});

export type RequestPrismaType = Prisma.RequestNewGetPayload<{
  include: typeof requestInclude;
}>;

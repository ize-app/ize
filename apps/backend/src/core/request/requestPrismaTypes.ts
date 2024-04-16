import { Prisma } from "@prisma/client";
import { flowVersionInclude } from "../flow/flowPrismaTypes";
import { fieldAnswerInclude, fieldOptionSetInclude } from "../fields/fieldPrismaTypes";
import { responseInclude } from "../response/responsePrismaTypes";
import { permissionInclude } from "../permission/permissionPrismaTypes";
import { userInclude } from "../user/userPrismaTypes";

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
  Responses: {
    include: responseInclude,
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

export const requestStepSummaryInclude = Prisma.validator<Prisma.RequestStepInclude>()({
  Request: {
    include: {
      FlowVersion: {
        include: {
          Flow: true,
        },
      },
      Creator: userInclude,
    },
  },
  Step: {
    include: {
      ResponsePermissions: {
        include: permissionInclude,
      },
    },
  },
});

export type RequestStepSummaryPrismaType = Prisma.RequestStepGetPayload<{
  include: typeof requestStepSummaryInclude;
}>;

export const requestInclude = Prisma.validator<Prisma.RequestInclude>()({
  RequestSteps: {
    include: requestStepInclude,
  },
  Creator: true,
  FlowVersion: {
    include: flowVersionInclude,
  },
});

export type RequestPrismaType = Prisma.RequestGetPayload<{
  include: typeof requestInclude;
}>;

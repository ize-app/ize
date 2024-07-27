import { Prisma } from "@prisma/client";

import { actionExecutionInclude } from "../action/actionPrismaTypes";
import { fieldAnswerInclude, fieldOptionSetInclude } from "../fields/fieldPrismaTypes";
import { createFlowVersionInclude } from "../flow/flowPrismaTypes";
import { permissionInclude } from "../permission/permissionPrismaTypes";
import { responseInclude } from "../response/responsePrismaTypes";
import { resultInclude } from "../result/resultPrismaTypes";
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

// for evolution requests, we want the proposed flow version and that flow version's
// corresponding flow and current flow version
export const evolveRequestProposedFlowVersionInclude =
  Prisma.validator<Prisma.FlowVersionInclude>()({
    Flow: {
      include: { CurrentFlowVersion: true },
    },
  });

export type EvolveRequestProposedFlowVersionPrismaType = Prisma.FlowVersionGetPayload<{
  include: typeof evolveRequestProposedFlowVersionInclude;
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
  Results: {
    include: resultInclude,
  },
  ActionExecution: {
    include: actionExecutionInclude,
  },
});

export type RequestStepPrismaType = Prisma.RequestStepGetPayload<{
  include: typeof requestStepInclude;
}>;

export const createRequestStepSummaryInclude = (userId: string) =>
  Prisma.validator<Prisma.RequestStepInclude>()({
    Request: {
      include: {
        FlowVersion: {
          include: {
            Flow: true,
          },
        },
        Creator: {
          include: userInclude,
        },
        ProposedFlowVersionEvolution: {
          include: evolveRequestProposedFlowVersionInclude,
        },
      },
    },
    Responses: {
      where: {
        creatorId: {
          equals: userId,
        },
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
const exampleRequestStepSummaryInclude = createRequestStepSummaryInclude("userId");

export type RequestStepSummaryPrismaType = Prisma.RequestStepGetPayload<{
  include: typeof exampleRequestStepSummaryInclude;
}>;

export const requestInclude = Prisma.validator<Prisma.RequestInclude>()({
  RequestSteps: {
    include: requestStepInclude,
  },
  Creator: {
    include: userInclude,
  },
  FlowVersion: {
    include: createFlowVersionInclude(undefined), // TODO: switch this out for the actual userId
  },
  ProposedFlowVersionEvolution: {
    include: evolveRequestProposedFlowVersionInclude,
  },
});

export type RequestPrismaType = Prisma.RequestGetPayload<{
  include: typeof requestInclude;
}>;

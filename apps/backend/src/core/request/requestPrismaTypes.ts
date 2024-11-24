import { Prisma } from "@prisma/client";

import { actionConfigInclude, actionInclude } from "../action/actionPrismaTypes";
import { entityInclude } from "../entity/entityPrismaTypes";
import { groupInclude } from "../entity/group/groupPrismaTypes";
import {
  fieldAnswerInclude,
  fieldOptionSetInclude,
  fieldSetInclude,
} from "../fields/fieldPrismaTypes";
import { createFlowVersionInclude } from "../flow/flowPrismaTypes";
import { responseConfigInclude } from "../response/responseConfigPrismaTypes";
import { responseInclude } from "../response/responsePrismaTypes";
import { resultConfigSetInclude, resultGroupInclude } from "../result/resultPrismaTypes";

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
  Responses: {
    include: responseInclude,
  },
  ResultGroups: {
    include: resultGroupInclude,
  },
  Actions: {
    include: actionInclude,
  },
});

export type RequestStepPrismaType = Prisma.RequestStepGetPayload<{
  include: typeof requestStepInclude;
}>;

export const createRequestSummaryInclude = (userEntityIds: string[]) =>
  Prisma.validator<Prisma.RequestInclude>()({
    FlowVersion: {
      include: {
        Flow: {
          include: {
            OwnerGroup: { include: groupInclude },
          },
        },
      },
    },
    CreatorEntity: {
      include: entityInclude,
    },
    ProposedFlowVersionEvolution: {
      include: evolveRequestProposedFlowVersionInclude,
    },
    CurrentRequestStep: {
      include: {
        Responses: {
          where: {
            creatorEntityId: { in: userEntityIds },
          },
        },
        ResultGroups: {
          include: resultGroupInclude,
        },
        Actions: {
          include: actionInclude,
        },
        Step: {
          include: {
            ResponseConfig: {
              include: responseConfigInclude,
            },
            ActionConfigSet: {
              include: {
                ActionConfigs: {
                  include: actionConfigInclude,
                },
              },
            },
            ResultConfigSet: {
              include: resultConfigSetInclude,
            },
            ResponseFieldSet: {
              include: fieldSetInclude,
            },
          },
        },
      },
    },
  });
const exampleRequestSummaryInclude = createRequestSummaryInclude([]);

export type RequestSummaryPrismaType = Prisma.RequestGetPayload<{
  include: typeof exampleRequestSummaryInclude;
}>;

export const requestInclude = Prisma.validator<Prisma.RequestInclude>()({
  TriggerFieldAnswers: {
    include: fieldAnswerInclude,
  },
  RequestDefinedOptionSets: {
    include: {
      FieldOptionSet: {
        include: fieldOptionSetInclude,
      },
    },
  },
  RequestSteps: {
    include: requestStepInclude,
  },
  CreatorEntity: {
    include: entityInclude,
  },
  FlowVersion: {
    include: createFlowVersionInclude([]), // TODO: switch this out for the actual userId
  },
  ProposedFlowVersionEvolution: {
    include: evolveRequestProposedFlowVersionInclude,
  },
});

export type RequestPrismaType = Prisma.RequestGetPayload<{
  include: typeof requestInclude;
}>;

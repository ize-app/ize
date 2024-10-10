import { entityResolver } from "@/core/entity/entityResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { Field, FlowType, Request, ResultConfig } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { requestStepResolver } from "./requestStepResolver";
import { flowResolver } from "../../flow/resolvers/flowResolver";
import { getEvolveRequestFlowName } from "../getEvolveRequestFlowName";
import { RequestPrismaType } from "../requestPrismaTypes";
import { getRequestStepIndex } from "../utils/getRequestStepIndex";

export const requestResolver = async ({
  req,
  userGroupIds,
  context,
}: {
  req: RequestPrismaType;
  userGroupIds: string[];
  context: GraphqlRequestContext;
}): Promise<Request> => {
  const responseFieldsCache: Field[] = [];
  const resultConfigsCache: ResultConfig[] = [];
  const identityIds = context.currentUser?.Identities.map((i) => i.id) ?? [];
  let flowNameOverride: string | null = null;

  if (req.FlowVersion.Flow.type === FlowType.Evolve) {
    flowNameOverride = getEvolveRequestFlowName({
      proposedFlowVersion: req.ProposedFlowVersionEvolution,
    });
  }

  // note: this call needs to happen before requestStepResolver is called
  // so that the response and result caches can be populated
  const flow = await flowResolver({
    flowVersion: req.FlowVersion,
    userGroupIds,
    userId: context.currentUser?.id,
    userIdentityIds: identityIds,
    flowNameOverride: flowNameOverride ?? undefined,
    responseFieldsCache,
    resultConfigsCache,
    context,
  });

  const requestSteps = await Promise.all(
    req.RequestSteps.sort((a, b) => {
      const aIndex = req.FlowVersion.Steps.find((step) => step.id === a.stepId);
      const bIndex = req.FlowVersion.Steps.find((step) => step.id === b.stepId);
      if (!aIndex || !bIndex)
        throw new GraphQLError("Cannot find corresponding flow step for request step.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      return aIndex.index - bIndex.index;
    }).map(async (reqStep) => {
      const step = req.FlowVersion.Steps.find((step) => step.id === reqStep.stepId);
      if (!step)
        throw new GraphQLError("Cannot find corresponding flow step for request step.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      return await requestStepResolver({
        reqStep,
        step,
        userId: context.currentUser?.id,
        responseFieldsCache,
        resultConfigsCache,
        requestFinal: req.final,
        context,
      });
    }),
  );

  const Request: Request = {
    name: req.name,
    creator: entityResolver({ entity: req.CreatorEntity, userIdentityIds: identityIds }),
    flow: flow,
    createdAt: req.createdAt.toISOString(),
    currentStepIndex: getRequestStepIndex(req, req.currentRequestStepId),
    final: req.final,
    requestId: req.id,
    steps: requestSteps,
  };
  return Request;
};

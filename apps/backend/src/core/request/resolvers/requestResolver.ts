import { Field, Request, ResultConfig } from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { RequestPrismaType } from "../requestPrismaTypes";
import { flowResolver } from "../../flow/resolvers/flowResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { requestStepResolver } from "./requestStepResolver";
import { userResolver } from "@/core/user/userResolver";

export const requestResolver = ({
  req,
  userGroupIds,
  context,
}: {
  req: RequestPrismaType;
  userGroupIds: string[];
  context: GraphqlRequestContext;
}): Request => {
  const responseFieldsCache: Field[] = [];
  const resultConfigsCache: ResultConfig[] = [];

  // note: this call needs to happen before requestStepResolver is called
  // so that the response and result caches can be populated
  const flow = flowResolver({
    flowVersion: req.FlowVersion,
    userGroupIds,
    userId: context.currentUser?.stytchId,
    userIdentityIds: context.currentUser ? context.currentUser.Identities.map((i) => i.id) : [],
    responseFieldsCache,
    resultConfigsCache,
  });

  const requestSteps = req.RequestSteps.sort((a, b) => {
    const aIndex = req.FlowVersion.Steps.find((step) => step.id === a.stepId);
    const bIndex = req.FlowVersion.Steps.find((step) => step.id === b.stepId);
    if (!aIndex || !bIndex)
      throw new GraphQLError("Cannot find corresponding flow step for request step.", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
    return aIndex.index - bIndex.index;
  }).map((reqStep) => {
    const step = req.FlowVersion.Steps.find((step) => step.id === reqStep.stepId);
    if (!step)
      throw new GraphQLError("Cannot find corresponding flow step for request step.", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    return requestStepResolver({
      reqStep,
      step,
      userId: context.currentUser?.id,
      responseFieldsCache,
      resultConfigsCache,
      requestFinal: req.final,
    });
  });

  const Request: Request = {
    name: req.name,
    creator: userResolver(req.Creator),
    flow: flow,
    createdAt: req.createdAt.toISOString(),
    currentStepIndex: req.RequestSteps.findIndex(
      (reqStep) => reqStep.id === req.currentRequestStepId,
    ),
    final: req.final,
    requestId: req.id,
    steps: requestSteps,
  };
  return Request;
};

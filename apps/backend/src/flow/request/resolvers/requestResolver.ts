import { RequestNew } from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { RequestPrismaType } from "../requestTypes";
import { flowVersionResolver } from "../../flow/resolvers/flowVersionResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { requestStepResolver } from "./requestStepResolver";

export const requestResolver = ({
  req,
  userGroupIds,
  context,
}: {
  req: RequestPrismaType;
  userGroupIds: string[];
  context: GraphqlRequestContext;
}): RequestNew => {
  const requestNew: RequestNew = {
    name: req.name,
    flow: flowVersionResolver({
      flowVersion: req.FlowVersion,
      userGroupIds,
      userId: context.currentUser?.stytchId,
      userIdentityIds: context.currentUser ? context.currentUser.Identities.map((i) => i.id) : [],
    }),
    createdAt: req.createdAt.toISOString(),
    currentStepIndex: req.RequestSteps.findIndex(
      (reqStep) => reqStep.id === req.currentRequestStepId,
    ),
    requestId: req.id,
    steps: req.RequestSteps.map((reqStep) => {
      const step = req.FlowVersion.Steps.find((step) => step.id === reqStep.stepId);
      if (!step)
        throw new GraphQLError("Cannot find corresponding flow step for request step.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      return requestStepResolver({ reqStep, step });
    }),
  };
  return requestNew;
};

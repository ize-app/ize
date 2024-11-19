import { GraphqlRequestContext } from "@/graphql/context";
import { MutationEndRequestStepArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";

import { finalizeStepResponses } from "./finalizeStepResponses";

export const endRequestStep = async ({
  args,
  context,
}: {
  args: MutationEndRequestStepArgs;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  const requestStepId = args.requestStepId;

  const requestStep = await prisma.requestStep.findFirstOrThrow({
    where: {
      id: requestStepId,
    },
    include: {
      Request: true,
      Responses: true,
      Step: {
        include: {
          ResponseConfig: true,
        },
      },
    },
  });

  const creatorEntityId = requestStep.Request.creatorEntityId;

  if (
    creatorEntityId !== context.currentUser?.entityId &&
    !(context.currentUser?.Identities ?? []).some((i) => i.entityId === creatorEntityId)
  )
    throw new GraphQLError("User does not have permission to end this step early.", {
      extensions: { code: CustomErrorCodes.InsufficientPermissions },
    });

  if (requestStep.responseFinal)
    throw new GraphQLError("Response already ended", {
      extensions: { code: CustomErrorCodes.InsufficientPermissions },
    });

  if ((requestStep.Step.ResponseConfig?.minResponses ?? 0) > requestStep.Responses.length)
    throw new GraphQLError("Not enough responses have been received to end early", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  await prisma.requestStep.update({
    where: {
      id: requestStepId,
    },
    data: {
      responseFinal: true,
    },
  });

  // since results are already computed, we don't need to create the results again
  // instead, we finalize them here and move on to the rest of the request step execution
  await finalizeStepResponses({ requestStepId });

  return true;
};

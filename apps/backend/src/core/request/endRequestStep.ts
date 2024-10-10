import { GraphqlRequestContext } from "@/graphql/context";
import { MutationEndRequestStepArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";

import { runResultsAndActions } from "../result/newResults/runResultsAndActions";

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
    },
  });

  const creatorEntityId = requestStep.Request.creatorEntityId;

  if (
    creatorEntityId !== context.currentUser?.id &&
    !(context.currentUser?.Identities ?? []).some((i) => i.entityId === creatorEntityId)
  )
    throw new GraphQLError("User does not have permission to end this step early.", {
      extensions: { code: CustomErrorCodes.InsufficientPermissions },
    });

  if (requestStep.responseFinal)
    throw new GraphQLError("Response already ended", {
      extensions: { code: CustomErrorCodes.InsufficientPermissions },
    });

  await prisma.requestStep.update({
    where: {
      id: requestStepId,
    },
    data: {
      responseFinal: true,
    },
  });

  await runResultsAndActions({
    requestStepId: requestStepId,
  });

  return true;
};

import { GraphqlRequestContext } from "@/graphql/context";
import { MutationEndRequestStepArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

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

  if (requestStep.Request.creatorId !== context.currentUser?.id) return false;
  if (requestStep.responseFinal) return true;

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

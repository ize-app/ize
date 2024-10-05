import { GraphqlRequestContext } from "@/graphql/context";
import { MutationEndRequestStepArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { stepInclude } from "../flow/flowPrismaTypes";
import { responseInclude } from "../response/responsePrismaTypes";
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
      Responses: {
        include: responseInclude,
      },
      Step: {
        include: stepInclude,
      },
      Request: true,
    },
  });

  if (requestStep.Request.creatorId !== context.currentUser?.id) return false;
  if (requestStep.responseComplete) return true;

  await prisma.requestStep.updateMany({
    where: {
      id: requestStepId,
    },
    data: {
      responseComplete: true,
    },
  });

  await runResultsAndActions({
    requestStepId: requestStepId,
    step: requestStep.Step,
    responses: requestStep.Responses,
  });

  return true;
};

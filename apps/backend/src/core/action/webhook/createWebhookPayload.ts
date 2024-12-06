import { Prisma } from "@prisma/client";

import { requestInclude } from "@/core/request/requestPrismaTypes";
import { requestResolver } from "@/core/request/resolvers/requestResolver";
import { ResultGroup, TriggerFieldAnswer } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { createRequestUrl } from "../../request/createRequestUrl";

export interface WebhookPayload {
  requestName: string;
  flowName: string;
  context: TriggerFieldAnswer[];
  results: ResultGroup[];
  requestUrl: string;
}

// Purpose of this function is to simplify output of request data so it can be output to other tools and stringified
export async function createWebhookPayload({
  requestStepId,
  transaction = prisma,
}: {
  requestStepId: string;
  transaction?: Prisma.TransactionClient;
}): Promise<WebhookPayload> {
  const reqStep = await transaction.requestStep.findUniqueOrThrow({
    include: {
      Request: {
        include: requestInclude,
      },
    },
    where: {
      id: requestStepId,
    },
  });

  const request = await requestResolver({
    req: reqStep.Request,
    context: { currentUser: null, discordApi: undefined, userEntityIds: [] },
    userGroupIds: [],
  });

  const results: ResultGroup[] = [];
  request.requestSteps.forEach((rs) => {
    results.push(...rs.results);
  });

  return {
    requestName: request.name,
    flowName: request.flow.name,
    context: request.triggerFieldAnswers,
    results,
    requestUrl: createRequestUrl({ requestId: request.requestId }),
  };
}

import { Prisma } from "@prisma/client";

import { requestInclude } from "@/core/request/requestPrismaTypes";
import { requestResolver } from "@/core/request/resolvers/requestResolver";
import { WebhookPayload } from "@/graphql/generated/resolver-types";

import { createRequestFieldsPayload } from "./createRequestFieldsPayload";
import { createRequestUrl } from "./createRequestUrl";
import { createResultsPayload } from "./createResultsPayload";
import { prisma } from "../../../prisma/client";

export const createNotificationPayload = async ({
  requestStepId,
  transaction = prisma,
}: {
  requestStepId: string;

  transaction?: Prisma.TransactionClient;
}): Promise<WebhookPayload> => {
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
  const formattedRequest = await requestResolver({
    req: reqStep.Request,
    context: { currentUser: null, discordApi: undefined },
    userGroupIds: [],
  });

  const requestFields = createRequestFieldsPayload({
    requestFields: formattedRequest.flow.fieldSet.fields,
    requestFieldAnswers: formattedRequest.triggerFieldAnswers,
  });

  const results = createResultsPayload(formattedRequest);

  return {
    createdAt: formattedRequest.createdAt,
    flowName: formattedRequest.flow.name,
    requestName: formattedRequest.name,
    requestFields,
    results,
    requestUrl: createRequestUrl({ requestId: formattedRequest.requestId }),
  };
};

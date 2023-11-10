import { requestInclude, formatRequest } from "../../utils/formatRequest";
import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import callWebhook from "./actionTypes/callWebhook";

const executeAction = async ({
  requestId,
  transaction = prisma,
}: {
  requestId: string;
  transaction?: Prisma.TransactionClient;
}) => {
  let wasSuccess: boolean;

  const reqRaw = await transaction.request.findFirst({
    include: requestInclude,
    where: {
      id: requestId,
    },
  });

  const request = formatRequest(reqRaw);
  if (request.process.action.actionDetails.__typename === "WebhookAction") {
    wasSuccess = await callWebhook({
      uri: request.process.action.actionDetails.uri,
      payload: request,
    });
  }

  await transaction.actionAttempt.create({
    data: {
      resultId: request.result.id,
      actionId: request.process.action.id,
      success: wasSuccess,
    },
  });
};

export default executeAction;

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
  const reqRaw = await transaction.request.findFirst({
    include: requestInclude,
    where: {
      id: requestId,
    },
  });

  const request = formatRequest(reqRaw);
  if (request.process.webhookUri)
    callWebhook({ uri: request.process.webhookUri, payload: request });
};

export default executeAction;

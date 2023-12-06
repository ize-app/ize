import { requestInclude, formatRequest } from "../../utils/formatRequest";
import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import callWebhook from "./actionTypes/callWebhook";
import editProcesses from "./actionTypes/editProcesses";

const executeAction = async ({
  requestId,
  transaction = prisma,
}: {
  requestId: string;
  transaction?: Prisma.TransactionClient;
}) => {
  let wasSuccess: boolean = false;

  const reqRaw = await transaction.request.findFirst({
    include: requestInclude,
    where: {
      id: requestId,
    },
  });

  const request = await formatRequest(reqRaw);

  if (!request.process.action) return;

  switch (request.process.action.actionDetails.__typename) {
    case "WebhookAction":
      wasSuccess = await callWebhook({
        uri: request.process.action.actionDetails.uri,
        payload: request,
      });
      break;
    case "EvolveProcessAction":
      // eslint-disable-next-line no-case-declarations
      const processVersions = request.inputs.find(
        (input) => (input.name = "Process versions"),
      ).value;
      wasSuccess = await editProcesses({
        processVersions: processVersions,
      });
      break;
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

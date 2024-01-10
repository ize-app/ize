import { requestInclude, formatRequest, RequestPrismaType } from "../../utils/formatRequest";
import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import callWebhook from "./actionTypes/callWebhook";
import editProcesses from "./actionTypes/editProcesses";
import { MePrismaType } from "@/utils/formatUser";

const executeAction = async ({
  requestId,
  transaction = prisma,
  user,
}: {
  requestId: string;
  transaction?: Prisma.TransactionClient;
  user: MePrismaType | undefined | null;
}) => {
  let wasSuccess: boolean = false;

  const reqRaw = await transaction.request.findFirst({
    include: requestInclude,
    where: {
      id: requestId,
    },
  });

  const request = await formatRequest(reqRaw as RequestPrismaType, user);

  if (!request.process.action?.actionDetails || !request.result)
    throw Error("ERROR Execute Action: Malformed result");

  switch (request.process.action.actionDetails.__typename) {
    case "WebhookAction":
      wasSuccess = await callWebhook({
        uri: request.process.action.actionDetails.uri,
        payload: request,
      });
      break;
    case "EvolveProcessAction":
      // eslint-disable-next-line no-case-declarations
      const processVersions = request.inputs.find((input) => (input.name = "Process versions"))
        ?.value;
      if (!processVersions) throw Error("ERROR Evolve Process Requese");
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

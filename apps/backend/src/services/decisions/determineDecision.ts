import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import { requestInclude } from "../../utils/formatRequest";
import { formatDecisionSystem } from "../../utils/formatProcess";
import createResult from "./createResult";
import { decideAbsoluteThreshold, decidePercentageThreshold } from "./decisionSystems";

import executeAction from "@services/actions/executeAction";
import { MePrismaType } from "@/utils/formatUser";

const responseGroupByArgs = {
  by: ["optionId"],
  _count: {
    optionId: true,
  },
} satisfies Prisma.ResponseGroupByArgs;

export type ResponseCount = Awaited<Prisma.GetResponseGroupByPayload<typeof responseGroupByArgs>>;

const determineDecision = async ({
  requestId,
  transaction = prisma,
  user,
}: {
  requestId: string;
  transaction?: Prisma.TransactionClient;
  user: MePrismaType | undefined | null;
}) => {
  let decidedOptionId: string | null;

  const responseCount = await transaction.response.groupBy({
    ...responseGroupByArgs,
    where: { requestId },
  });

  const request = await transaction.request.findFirstOrThrow({
    include: requestInclude,
    where: {
      id: requestId,
    },
  });

  const decisionSystem = formatDecisionSystem(request.processVersion.decisionSystem);

  switch (decisionSystem.__typename) {
    case "AbsoluteDecision":
      decidedOptionId = decideAbsoluteThreshold(decisionSystem, responseCount);
      break;
    case "PercentageDecision":
      decidedOptionId = decidePercentageThreshold(decisionSystem, responseCount);
      break;
    default:
      throw Error("ERROR: determineDecision - can't find decision system.");
  }

  if (decidedOptionId) {
    await createResult({
      requestId,
      optionId: decidedOptionId,
      transaction,
    });
    await executeAction({ requestId, transaction, user });
  }
  //
};

export default determineDecision;

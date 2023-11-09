import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "@graphql/context";
import { Prisma } from "@prisma/client";
import { requestInclude } from "../../utils/formatRequest";
import { formatDecisionSystem } from "../../utils/formatProcess";
import createResult from "./createResult";
import {
  decideAbsoluteThreshold,
  decidePercentageThreshold,
} from "./decisionSystems";

import executeAction from "@services/actions/executeAction";

const responseGroupByArgs = {
  by: ["optionId"],
  _count: {
    optionId: true,
  },
} satisfies Prisma.ResponseGroupByArgs;

export type ResponseCount = Awaited<
  Prisma.GetResponseGroupByPayload<typeof responseGroupByArgs>
>;

const determineDecision = async ({
  requestId,
  transaction = prisma,
}: {
  requestId: string;
  transaction?: Prisma.TransactionClient;
}) => {
  let decidedOptionId: string | null;
  let resultId: string | null;

  const responseCount = await transaction.response.groupBy({
    ...responseGroupByArgs,
    where: { requestId },
  });

  const request = await transaction.request.findFirst({
    include: requestInclude,
    where: {
      id: requestId,
    },
  });

  const decisionSystem = formatDecisionSystem(
    request.processVersion.decisionSystem,
  );

  switch (decisionSystem.__typename) {
    case "AbsoluteDecision":
      decidedOptionId = decideAbsoluteThreshold(decisionSystem, responseCount);
      break;
    case "PercentageDecision":
      decidedOptionId = decidePercentageThreshold(
        decisionSystem,
        responseCount,
      );
      break;
  }

  if (decidedOptionId) {
    resultId = await createResult({
      requestId,
      optionId: decidedOptionId,
      transaction,
    });
    await executeAction({ requestId, transaction });
  }
  //
};

export default determineDecision;

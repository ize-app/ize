import { DecisionType } from "@prisma/client";

import { ResultType } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { resultGroupInclude } from "./resultPrismaTypes";
import { stepInclude } from "../flow/flowPrismaTypes";

// see if there are any results yet which would end the request early
// so far, this only applies to decisions
export const checkToEndResponseEarly = async ({
  requestStepId,
}: {
  requestStepId: string;
}): Promise<boolean> => {
  let hasEarlyResult = false;
  try {
    const reqStep = await prisma.requestStep.findFirstOrThrow({
      where: {
        id: requestStepId,
      },
      include: {
        Step: {
          include: stepInclude,
        },
        ResultGroups: {
          include: resultGroupInclude,
        },
      },
    });

    for (const resultGroup of reqStep.ResultGroups) {
      if (!resultGroup.complete || resultGroup.Result[0].ResultItems.length === 0) continue;
      const resultConfig = (reqStep.Step.ResultConfigSet?.ResultConfigs ?? []).find(
        (r) => r.id === resultGroup.resultConfigId,
      );
      if (!resultConfig) continue;
      if (
        resultConfig.resultType === ResultType.Decision &&
        resultConfig.ResultConfigDecision &&
        resultConfig.ResultConfigDecision.type === DecisionType.NumberThreshold
      ) {
        hasEarlyResult = true;
        break;
      }
    }
    return hasEarlyResult;
  } catch (e) {
    console.log("Error checkIfEarlyResults: ", e);
    return false;
  }
};

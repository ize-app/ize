import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { responseInclude } from "@/core/response/responsePrismaTypes";
import { prisma } from "@/prisma/client";

import { NewResultReturn, newResult } from "./newResult";
import { retryResult } from "./retryResult";
import { resultGroupInclude } from "../resultPrismaTypes";

// create all results for a given step
// run after every response
// some result records will not have a result and others will need to be retried
export const newResultsForStep = async ({
  requestStepId,
  isRetry = false,
}: {
  requestStepId: string;
  isRetry?: boolean;
}): Promise<NewResultReturn> => {
  try {
    const reqStep = await prisma.requestStep.findFirstOrThrow({
      where: {
        id: requestStepId,
      },
      include: {
        Request: {
          include: {
            FlowVersion: true,
          },
        },
        Step: {
          include: stepInclude,
        },
        ResultGroups: {
          include: resultGroupInclude,
          orderBy: { index: "asc" },
        },
        Responses: {
          include: responseInclude,
        },
      },
    });

    const { Step: step, Responses: responses, ResultGroups: existingResults } = reqStep;

    const resultConfigs = step.ResultConfigSet?.ResultConfigs ?? [];

    if (step.ResponseConfig && responses.length < step.ResponseConfig.minResponses) {
      return { endStepEarly: false };
    }

    const results = await Promise.allSettled(
      resultConfigs.map(async (resultConfig): Promise<NewResultReturn> => {
        const existingResultGroup = existingResults.find(
          (r) => r.resultConfigId === resultConfig.id,
        );
        if (isRetry) {
          if (existingResultGroup?.complete) return { endStepEarly: false };
          else
            return await retryResult({
              requestStepId,
              resultConfig,
              existingResultGroup,
              responses,
            });
        }
        return await newResult({
          requestStepId,
          resultConfig,
          existingResultGroup,
          responses,
        });
      }),
    );
    return { endStepEarly: results.some((r) => r.status === "fulfilled" && r.value.endStepEarly) };
  } catch (error) {
    console.error("Error in newResultsForStep:", error);
    return { endStepEarly: false };
  }
};

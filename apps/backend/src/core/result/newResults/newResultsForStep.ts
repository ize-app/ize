import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { responseInclude } from "@/core/response/responsePrismaTypes";
import { prisma } from "@/prisma/client";

import { newResult } from "./newResult";
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
}): Promise<void> => {
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
        },
        Responses: {
          include: responseInclude,
        },
      },
    });

    const { Step: step, Responses: responses, ResultGroups: existingResults } = reqStep;

    // don't create results if step doesn't have enough responses
    if (step.ResponseConfig && responses.length < step.ResponseConfig.minResponses) return;

    const resultConfigs =
      step.ResultConfigSet?.ResultConfigSetResultConfigs.map((r) => r.ResultConfig) ?? [];

    await Promise.allSettled(
      resultConfigs.map(async (resultConfig): Promise<void> => {
        const existingResultGroup = existingResults.find(
          (r) => r.resultConfigId === resultConfig.id,
        );
        if (isRetry) {
          if (existingResultGroup?.complete) return;
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
    return;
  } catch (error) {
    console.error("Error in newResultsForStep:", error);
    return;
  }
};

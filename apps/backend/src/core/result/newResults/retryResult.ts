import { Prisma } from "@prisma/client";

import { finalizeRequestStepForFailedResults } from "@/core/request/updateState/finalizeRequestStepForFailedResults";

import { NewResult, newResult } from "./newResult";

export type NewResultArgs = Omit<Prisma.ResultUncheckedCreateInput, "resultGroupId" | "index">;

export const retryResult = async ({
  requestStepId,
  resultConfig,
  existingResultGroup,
  responses,
}: NewResult): Promise<void> => {
  const maxResultRetries = 20;

  // check if result is ready to be retried again, if not do not create a result
  if (existingResultGroup?.nextRetryAt && existingResultGroup.nextRetryAt > new Date()) return;
  // if result has been retried too many times, mark step as complete but with no result
  else if ((existingResultGroup?.retryAttempts ?? 0) > maxResultRetries) {
    await finalizeRequestStepForFailedResults({ requestStepId });
    return;
  } else {
    return await newResult({
      requestStepId,
      resultConfig,
      existingResultGroup,
      responses,
    });
  }
};

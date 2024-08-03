import { RequestPrismaType } from "../requestPrismaTypes";

export const getRequestStepIndex = (
  request: RequestPrismaType,
  requestStepId: string | null,
): number => {
  if (!requestStepId) return 0;
  return request.RequestSteps.findIndex((reqStep) => reqStep.id === requestStepId);
};

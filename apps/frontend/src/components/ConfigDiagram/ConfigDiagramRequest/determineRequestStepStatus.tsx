import { RequestStatus } from "@/components/status/type";

export const determineRequestStepStatus = (
  requestStepIndex: number,
  requestStepFinal: boolean,
  currentStepIndex: number,
): RequestStatus => {
  if (requestStepIndex <= currentStepIndex && requestStepFinal) return RequestStatus.Completed;
  else if (requestStepIndex === currentStepIndex) return RequestStatus.InProgress;
  else if (requestStepIndex < currentStepIndex) return RequestStatus.Completed;
  else return RequestStatus.Pending;
};

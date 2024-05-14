import { Status } from "@/graphql/generated/graphql";

export const determineRequestStepStatus = (
  requestStepIndex: number,
  requestStepFinal: boolean,
  currentStepIndex: number,
  // refers to whether the request as a whole (not just the request step) is final
  requestFinal: boolean,
): Status => {
  if (requestStepIndex <= currentStepIndex && requestStepFinal) return Status.Completed;
  else if (requestStepIndex === currentStepIndex) return Status.InProgress;
  else if (requestStepIndex > currentStepIndex && requestFinal) return Status.Cancelled;
  else return Status.NotAttempted;
};

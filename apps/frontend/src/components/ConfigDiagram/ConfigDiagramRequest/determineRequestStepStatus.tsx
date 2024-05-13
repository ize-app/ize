import { Status } from "@/graphql/generated/graphql";

export const determineRequestStepStatus = (
  requestStepIndex: number,
  requestStepFinal: boolean,
  currentStepIndex: number,
): Status => {
  if (requestStepIndex <= currentStepIndex && requestStepFinal) return Status.Completed;
  else if (requestStepIndex === currentStepIndex) return Status.InProgress;
  else if (requestStepIndex < currentStepIndex) return Status.Completed;
  else return Status.NotAttempted;
};

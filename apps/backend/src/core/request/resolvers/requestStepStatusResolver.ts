import { RequestStep } from "@prisma/client";

import { RequestStepStatus, RequestStepStatuses } from "@/graphql/generated/resolver-types";

export const requestStepStatusResolver = ({
  requestStep,
  hasActionError,
  hasResultsError,
}: {
  requestStep: RequestStep;
  hasActionError: boolean;
  hasResultsError: boolean;
}): RequestStepStatuses => {
  const { final, actionsFinal, resultsFinal, responseFinal } = requestStep;

  let status: RequestStepStatus;
  if (hasActionError || hasResultsError) status = RequestStepStatus.Error;
  if (final || actionsFinal) status = RequestStepStatus.Complete;
  else if (resultsFinal) status = RequestStepStatus.ExecutingAction;
  else if (responseFinal) status = RequestStepStatus.CreatingResult;
  else status = RequestStepStatus.CollectingResponses;

  return { actionsFinal, resultsFinal, responseFinal, final, status };
};

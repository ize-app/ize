import { Field, Request } from "@/graphql/generated/resolver-types";

export const getFieldForRequestConfigId = ({
  request,
  requestStepId,
  resultConfigId,
}: {
  request: Request;
  requestStepId: string;
  resultConfigId: string;
}): Field => {
  const requestStep = request.requestSteps.find((rs) => rs.requestStepId === requestStepId);
  const step = request.flow.steps.find((s) => s.id === requestStep?.stepId);
  const field = step?.result.find((s) => s.resultConfigId === resultConfigId)?.field;

  if (!field) throw new Error(`Field not found for ${resultConfigId}`);

  return field;
};

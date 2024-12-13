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
  const stepField = step?.result.find((s) => s.resultConfigId === resultConfigId)?.field;
  const field = requestStep?.fieldSet.fields.find((f) => f.fieldId === stepField?.fieldId);

  if (!field) throw new Error(`Field not found for ${resultConfigId}`);

  return field;
};

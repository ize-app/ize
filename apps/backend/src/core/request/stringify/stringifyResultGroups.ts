import { Request, ResultConfig, ResultGroup, Value } from "@/graphql/generated/resolver-types";

import { FieldsAndValues, stringifyFieldsAndValuesSet } from "./stringifyFieldAndValues";

const getRequestConfig = ({
  stepId,
  resultConfigId,
  request,
}: {
  stepId: string;
  resultConfigId: string;
  request: Request;
}): ResultConfig => {
  const step = request.flow.steps.find((step) => step.id === stepId);
  const requestConfig = step?.result.find((result) => result.resultConfigId === resultConfigId);
  if (!requestConfig)
    throw new Error(`Request config not found for ${stepId} and ${resultConfigId}`);
  return requestConfig;
};

export const stringifyResultGroups = ({
  title,
  request,
  type,
  requestStepId,
  resultConfigId,
  excludeRequestStepId,
}: {
  title?: string;
  request: Request;
  requestStepId?: string;
  resultConfigId?: string;
  excludeRequestStepId?: string;
  type: "html" | "markdown";
}): string => {
  const results: [ResultGroup, ResultConfig][] = [];
  const fieldsAndValuesSet: FieldsAndValues[] = [];

  const noResultValue: Value = { __typename: "StringValue", value: "No result" };

  outerLoop: for (const rs of request.requestSteps) {
    if (excludeRequestStepId && rs.requestStepId === excludeRequestStepId) continue;
    if (requestStepId && rs.requestStepId !== requestStepId) continue;
    for (const resultGroup of rs.results) {
      if (resultConfigId && resultGroup.resultConfigId !== resultConfigId) continue;
      const resultConfig = getRequestConfig({
        stepId: rs.stepId,
        resultConfigId: resultGroup.resultConfigId,
        request,
      });
      results.push([resultGroup, resultConfig]);
      if (resultConfigId === resultGroup.resultConfigId) break outerLoop;
    }
    if (requestStepId === rs.requestStepId) break;
  }

  results.map(([resultGroup, resultConfig]) => {
    // return `${stringifyGenericFieldValues({ values: resultGroup.result, type })}`;
    const fieldAndValues: FieldsAndValues = {
      title: resultConfig.name,
      subtitle: resultConfig.field.name,
      fieldsAndValues: [],
    };

    fieldsAndValuesSet.push(fieldAndValues);

    resultGroup.results.map((result) => {
      fieldAndValues.fieldsAndValues.push({
        field: result.name,
        value:
          result.resultItems.length > 0
            ? result.resultItems.map((item) => item.value)
            : noResultValue,
      });
    });
  });

  return stringifyFieldsAndValuesSet({
    fieldsAndValuesSet,
    type,
    setTitle: title,
  });
};

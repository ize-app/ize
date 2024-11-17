import { FieldType, ResultArgs, ResultType } from "@/graphql/generated/graphql";

import { ResultConfigCache } from "./createNewFlowArgs";
import { FieldsSchemaType } from "../../formValidation/fields";
import { ResultSchemaType, ResultsSchemaType } from "../../formValidation/result";

export const createResultArgs = (
  result: ResultSchemaType,
  responseFields: FieldsSchemaType | undefined | null,
): ResultArgs => {
  if (!responseFields) throw Error("Missing response fields for result>");

  const responseFieldIndex = responseFields
    ? responseFields.findIndex((f) => f.fieldId === result.fieldId)
    : null;

  if (responseFieldIndex === null || responseFieldIndex === -1)
    throw Error("Cannot find response field for result");

  if (result.type === ResultType.Decision) {
    let defaultOptionIndex: number | null = null;
    if (result.decision.defaultDecision) {
      if (result.decision.defaultDecision.optionId) {
        const responseField = responseFields[responseFieldIndex];
        if (!responseField || responseField.type !== FieldType.Options)
          throw Error("Missing option set for default result");
        const options = responseField.optionsConfig.options;
        defaultOptionIndex = options.findIndex(
          (option) => option.optionId === result.decision.defaultDecision?.optionId,
        );
        if (defaultOptionIndex === -1) throw Error("Default option not found ");
      }
      delete result.decision.defaultDecision;
    }
    return {
      ...result,
      responseFieldIndex,
      decision: {
        ...result.decision,
        defaultOptionIndex,
      },
    };
  }

  return { ...result, responseFieldIndex };
};

export const createResultsArgs = (
  results: ResultsSchemaType,
  responseFields: FieldsSchemaType,
  stepIndex: number,
  resultConfigCache: ResultConfigCache[],
): ResultArgs[] => {
  return results.map((resultConfig, resultIndex) => {
    resultConfigCache.push({ id: resultConfig.resultId, stepIndex, resultIndex });
    return createResultArgs(resultConfig, responseFields);
  });
};

import { FieldType, ResultArgs, ResultType } from "@/graphql/generated/graphql";
import { ResultSchemaType, ResultsSchemaType } from "../../formValidation/result";
import { DefaultOptionSelection, FieldsSchemaType } from "../../formValidation/fields";
import { ResultConfigCache } from "./createNewFlowArgs";

export const createResultArgs = (
  result: ResultSchemaType,
  responseFields: FieldsSchemaType | undefined | null,
): ResultArgs => {
  if (result.type === ResultType.Decision && result.decision.defaultOptionId) {
    let defaultOptionIndex: number | null = null;
    let responseFieldIndex = responseFields
      ? responseFields.findIndex((f) => f.fieldId === result.fieldId)
      : null;

    if (
      result.decision.defaultOptionId !== DefaultOptionSelection.None.toString() &&
      responseFieldIndex &&
      responseFields
    ) {
      const responseField = responseFields[responseFieldIndex];
      if (!responseField || responseField.type !== FieldType.Options)
        throw Error("Missing option set for default result");
      const options = responseField.optionsConfig.options;
      defaultOptionIndex = options.findIndex(
        (option) => option.optionId === result.decision.defaultOptionId,
      );
      if (defaultOptionIndex === -1) throw Error("Default option not found ");
    }

    delete result.decision.defaultOptionId;
    return {
      ...result,
      responseFieldIndex,
      decision: {
        ...result.decision,
        defaultOptionIndex,
      },
    };
  }
  return result;
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

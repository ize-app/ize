import { FieldType, ResultArgs, ResultType } from "@/graphql/generated/graphql";
import { ResultSchemaType, ResultsSchemaType } from "../../formValidation/result";
import {
  DefaultOptionSelection,
  FieldSchemaType,
  FieldsSchemaType,
} from "../../formValidation/fields";

export const createResultArgs = (
  result: ResultSchemaType,
  responseField: FieldSchemaType | undefined | null,
): ResultArgs => {
  if (result.type === ResultType.Decision && result.decision.defaultOptionId) {
    let defaultOptionIndex: number | null = null;

    if (result.decision.defaultOptionId !== DefaultOptionSelection.None.toString()) {
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
): ResultArgs[] => {
  return results.map((result) => {
    const responseField = responseFields.find((f) => f.fieldId === result.fieldId);
    return createResultArgs(result, responseField);
  });
};

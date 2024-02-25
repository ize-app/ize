import { FieldType, ResultArgs, ResultType } from "@/graphql/generated/graphql";
import { ResultSchemaType } from "../../formValidation/result";
import { DefaultOptionSelection, FieldSchemaType } from "../../formValidation/fields";

export const createResultArgs = (
  result: ResultSchemaType,
  responseField: FieldSchemaType | undefined,
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

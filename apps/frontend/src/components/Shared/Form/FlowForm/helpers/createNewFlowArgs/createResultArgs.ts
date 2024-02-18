import { FieldType, ResultArgs, ResultType } from "@/graphql/generated/graphql";
import { ResultSchemaType } from "../../formValidation/result";
import { FieldSchemaType } from "../../formValidation/fields";

export const createResultArgs = (
  result: ResultSchemaType,
  responseField: FieldSchemaType | undefined,
): ResultArgs => {
  if (result.type === ResultType.Decision && result.decision.defaultOptionId) {
    if (!responseField || responseField.type !== FieldType.Options) throw Error();
    const options = responseField.optionsConfig.options;
    let defaultOptionIndex: number = options.findIndex(
      (option) => option.optionId === result.decision.defaultOptionId,
    );
    if (defaultOptionIndex === -1) throw Error("Default option not found ");
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

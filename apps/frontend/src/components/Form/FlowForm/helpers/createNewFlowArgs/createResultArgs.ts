import { ResultArgs, ResultType } from "@/graphql/generated/graphql";

import { FieldsSchemaType } from "../../formValidation/fields";
import { ResultSchemaType, ResultsSchemaType } from "../../formValidation/result";

export const createResultArgs = (
  result: ResultSchemaType,
  responseFields: FieldsSchemaType | undefined | null,
): ResultArgs => {
  if (!responseFields) throw Error("Missing response fields for result>");
  if (result.type === ResultType.Decision) {
    const defaultOptionId: string | null = result.decision.defaultDecision?.optionId ?? null;
    delete result.decision.defaultDecision;
    return {
      ...result,
      decision: {
        ...result.decision,
        defaultOptionId,
      },
    };
  }

  return { ...result };
};

export const createResultsArgs = (
  results: ResultsSchemaType,
  responseFields: FieldsSchemaType,
): ResultArgs[] => {
  return results.map((resultConfig) => {
    return createResultArgs(resultConfig, responseFields);
  });
};

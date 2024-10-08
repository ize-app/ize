import { FieldArgs, FieldType } from "@/graphql/generated/graphql";

import { ResultConfigCache } from "./createNewFlowArgs";
import { FieldSchemaType, FieldsSchemaType } from "../../formValidation/fields";

export const createFieldsArgs = (
  fields: FieldsSchemaType,
  resultConfigCache: ResultConfigCache[],
): FieldArgs[] => {
  return (fields ?? []).map((field): FieldArgs => {
    return createFieldArgs(field, resultConfigCache);
  });
};

export const createFieldArgs = (
  field: FieldSchemaType,
  resultConfigCache: ResultConfigCache[],
): FieldArgs => {
  if (field.type === FieldType.FreeInput) {
    const { fieldId, required, name, type, freeInputDataType } = field;
    return {
      type,
      fieldId,
      freeInputDataType,
      required,
      name,
    };
  } else if (field.type === FieldType.Options) {
    const { fieldId, required, name, type, optionsConfig } = field;
    return {
      type,
      fieldId,
      required,
      name,
      optionsConfig: {
        ...optionsConfig,
        options: optionsConfig.options.map((option) => {
          return {
            ...option,
            //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            name: option.name,
          };
        }),
        linkedResultOptions: optionsConfig.linkedResultOptions.map((linkedResult) => {
          const resultConfigLocation = resultConfigCache.find((r) => r.id === linkedResult.id);
          if (!resultConfigLocation)
            throw Error("Cannot find correspond result config for linked option config");
          return {
            stepIndex: resultConfigLocation.stepIndex,
            resultIndex: resultConfigLocation.resultIndex,
          };
        }),
      },
    };
  } else {
    throw Error("Unknown option type");
  }
};

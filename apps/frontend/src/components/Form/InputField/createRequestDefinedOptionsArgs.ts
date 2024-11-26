import { FieldOptionArgs, FieldType, RequestDefinedOptionsArgs } from "@/graphql/generated/graphql";
import { RequestDefinedOptionsRecordSchema } from "@/pages/NewRequest/formValidation";

import { createInputValueArg } from "./createInputValueArg";

export const createRequestDefinedOptionsArgs = (
  requestDefinedOptions: RequestDefinedOptionsRecordSchema,
): RequestDefinedOptionsArgs[] => {
  return Object.entries(requestDefinedOptions).map(([fieldId, options]) => {
    return {
      fieldId,
      options: options
        .map(
          //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          (option): FieldOptionArgs | null => {
            if (option.type === FieldType.Options) return null;
            return {
              optionId: crypto.randomUUID(),
              name: createInputValueArg(option),
              dataType: option.type,
            };
          },
        )
        .filter((option) => !!option),
    };
  });
};

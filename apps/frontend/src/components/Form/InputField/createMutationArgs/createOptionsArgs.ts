import { FieldOptionArgs, FieldType, RequestDefinedOptionsArgs } from "@/graphql/generated/graphql";
import { RequestDefinedOptionsRecordSchema } from "@/pages/NewRequest/requestValidation";

import { createInputValueArg } from "./createInputValueArg";
import { OptionSchemaType } from "../inputValidation";

export const createOptionsArgs = (options: OptionSchemaType[]): FieldOptionArgs[] => {
  return options
    .map(
      //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      (option): FieldOptionArgs | null => {
        const { type } = option.input;
        if (type === FieldType.Options) return null;
        return {
          optionId: option.optionId,
          name: createInputValueArg(option.input),
          dataType: type,
        };
      },
    )
    .filter((option) => !!option);
};

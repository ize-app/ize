import { OptionArgs, ValueType } from "@/graphql/generated/graphql";

import { createInputValueArg } from "./createInputValueArg";
import { OptionSchemaType } from "../inputValidation";

export const createOptionsArgs = (options: OptionSchemaType[]): OptionArgs[] => {
  return options
    .map(
      //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      (option): OptionArgs | null => {
        const { type } = option.input;
        if (type === ValueType.OptionSelections) return null;
        return {
          optionId: option.optionId,
          type: option.input.type,
          value: createInputValueArg(option.input),
        };
      },
    )
    .filter((option) => !!option);
};

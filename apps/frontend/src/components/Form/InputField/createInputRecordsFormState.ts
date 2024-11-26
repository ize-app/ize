import { FieldFragment, FieldType, OptionSelectionType } from "@/graphql/generated/graphql";

import { createFreeInputDefaultValue } from "./createFreeInputDefaultState";
import {
  InputRecordSchemaType,
  InputSchemaType,
  OptionSelectionsSchemaType,
} from "./inputValidation";

export const createInputRecordsFormState = ({
  fields,
}: {
  fields: FieldFragment[];
}): InputRecordSchemaType => {
  const responseFieldAnswers: InputRecordSchemaType = {};
  fields.map((f) => {
    let answer: InputSchemaType;
    if (f.__typename === FieldType.FreeInput) {
      //   const defaultValue = createFreeInputDefaultValue({
      //     defaultValue: f?.defaultAnswer,
      //     dataType: f.dataType,
      //   });
      answer = {
        type: f.dataType,
        required: f.required,
        //@ts-expect-error type inference not working here
        value: createFreeInputDefaultValue({
          dataType: f.dataType,
          defaultValue: f?.defaultAnswer,
        }),
      };
    } else {
      let optionSelections: OptionSelectionsSchemaType | undefined = undefined;
      if (f.selectionType === OptionSelectionType.Rank) optionSelections = f.options;
      answer = {
        type: FieldType.Options,
        required: f.required,
        selectionType: f.selectionType,
        maxSelections: f.maxSelections,
        //@ts-expect-error type inference not working here
        value: optionSelections,
      };
    }
    responseFieldAnswers[f.fieldId] = answer;
  });

  return responseFieldAnswers;
};

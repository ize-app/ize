import { FieldFragment } from "@/graphql/generated/graphql";

import { InputRecordSchemaType } from "../inputValidation";
import { createInputValueFormState } from "./createInputFormState";

export const createInputRecordsFormState = ({
  fields,
}: {
  fields: FieldFragment[];
}): InputRecordSchemaType => {
  const responseFieldAnswers: InputRecordSchemaType = {};
  fields.map((f) => {
    responseFieldAnswers[f.fieldId] = createInputValueFormState({
      type: "field",
      value: f.defaultAnswer ?? undefined,
      field: f,
    });
  });

  return responseFieldAnswers;
};

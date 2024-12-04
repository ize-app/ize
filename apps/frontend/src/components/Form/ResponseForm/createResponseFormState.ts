import { FieldFragment } from "@/graphql/generated/graphql";

import { ResponseSchemaType } from "./responseValidation";
import { createInputRecordsFormState } from "../InputField/createFormState/createInputRecordsFormState";
import { InputRecordSchemaType } from "../InputField/inputValidation";

export const createResponseFormState = ({
  fields,
}: {
  fields: FieldFragment[];
}): ResponseSchemaType => {
  const responseFieldAnswers: InputRecordSchemaType = createInputRecordsFormState({ fields });

  return { responseId: crypto.randomUUID(), responseFields: responseFieldAnswers };
};

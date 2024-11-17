import { FieldFragment } from "@/graphql/generated/graphql";

import { ResponseSchemaType } from "./formValidation";
import { FieldAnswerRecordSchemaType } from "../formValidation/field";
import { createFieldAnswersFormState } from "../utils/createFieldAnswersFormState";

export const createResponseFormState = ({
  fields,
}: {
  fields: FieldFragment[];
}): ResponseSchemaType => {
  const responseFieldAnswers: FieldAnswerRecordSchemaType = createFieldAnswersFormState({ fields });

  return { responseFields: responseFieldAnswers };
};

import { FieldFragment } from "@/graphql/generated/graphql";

import { ResponseSchemaType } from "./formValidation";
import { createFieldAnswersFormState } from "../createFieldAnswersFormState";
import { FieldAnswerRecordSchemaType } from "../formValidation/field";

export const createResponseFormState = ({
  fields,
}: {
  fields: FieldFragment[];
}): ResponseSchemaType => {
  const responseFieldAnswers: FieldAnswerRecordSchemaType = createFieldAnswersFormState({ fields });

  return { responseFields: responseFieldAnswers };
};

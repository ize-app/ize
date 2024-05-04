import { FieldAnswerFragment, FieldFragment } from "@/graphql/generated/graphql";
import { Field } from "./Field";
import Box from "@mui/material/Box";

export const Fields = ({
  fields,
  fieldAnswers,
}: {
  fields: FieldFragment[];
  fieldAnswers?: FieldAnswerFragment[];
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {fields.map((field) => {
        let fieldAnswer: FieldAnswerFragment | undefined;
        if (fieldAnswers) {
          fieldAnswer = fieldAnswers.find((fa) => fa.fieldId === field.fieldId) ?? undefined;
        }

        return <Field key={field.fieldId} field={field} fieldAnswer={fieldAnswer} />;
      })}
    </Box>
  );
};

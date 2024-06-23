import Box from "@mui/material/Box";

import { FieldAnswerFragment, FieldFragment } from "@/graphql/generated/graphql";

import { Field } from "./Field";

export const Fields = ({
  fields,
  fieldAnswers,
  onlyShowSelections = false,
}: {
  fields: FieldFragment[];
  fieldAnswers?: FieldAnswerFragment[];
  onlyShowSelections?: boolean;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {fields.map((field) => {
        let fieldAnswer: FieldAnswerFragment | undefined;
        if (fieldAnswers) {
          fieldAnswer = fieldAnswers.find((fa) => fa.fieldId === field.fieldId) ?? undefined;
        }

        return (
          <Field
            key={field.fieldId}
            field={field}
            fieldAnswer={fieldAnswer}
            onlyShowSelections={onlyShowSelections}
          />
        );
      })}
    </Box>
  );
};

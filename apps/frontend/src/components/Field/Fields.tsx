import Box from "@mui/material/Box";

import { FieldAnswerFragment, FieldSetFragment } from "@/graphql/generated/graphql";

import { Field } from "./Field";

export const FieldSet = ({
  fieldSet: fieldSet,
  fieldAnswers,
  onlyShowSelections = false,
}: {
  fieldSet: FieldSetFragment;
  fieldAnswers?: FieldAnswerFragment[];
  onlyShowSelections?: boolean;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {fieldSet.fields.map((field) => {
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

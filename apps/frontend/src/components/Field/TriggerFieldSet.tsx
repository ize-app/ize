import Box from "@mui/material/Box";

import { FieldSetFragment, TriggerFieldAnswerFragment } from "@/graphql/generated/graphql";

import { Field } from "./Field";

export const TriggerFieldSet = ({
  fieldSet: fieldSet,
  fieldAnswers,
  onlyShowSelections = false,
}: {
  fieldSet: FieldSetFragment;
  fieldAnswers?: TriggerFieldAnswerFragment[];
  onlyShowSelections?: boolean;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {fieldSet.fields.map((field) => {
        let triggerFieldAnswer: TriggerFieldAnswerFragment | undefined;
        if (fieldAnswers) {
          triggerFieldAnswer =
            fieldAnswers.find((fa) => fa.field.fieldId === field.fieldId) ?? undefined;
        }

        return (
          <Field
            key={field.fieldId}
            field={field}
            fieldAnswer={triggerFieldAnswer?.answer.answer ?? undefined}
            onlyShowSelections={onlyShowSelections}
          />
        );
      })}
    </Box>
  );
};

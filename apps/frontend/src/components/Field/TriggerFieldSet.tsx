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
    // <Accordion label="Request context" elevation={0} defaultExpanded={true}>
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {fieldSet.fields.map((field) => {
        let triggerFieldAnswer: TriggerFieldAnswerFragment | undefined;
        if (fieldAnswers) {
          triggerFieldAnswer =
            fieldAnswers.find((fa) => fa.field.fieldId === field.fieldId) ?? undefined;
        }

        if (fieldAnswers && !triggerFieldAnswer?.answer) return;

        return (
          <Field
            key={field.fieldId}
            field={field}
            fieldAnswer={triggerFieldAnswer?.answer}
            onlyShowSelections={onlyShowSelections}
          />
        );
      })}
    </Box>
  );
};

import { Box } from "@mui/material";

import { UserFieldAnswers } from "@/components/Field/UserFieldAnswers";
import {
  FieldFragment,
  RequestFragment,
  UserFieldAnswerFragment,
} from "@/graphql/generated/graphql";

export const Responses = ({ request }: { request: RequestFragment }) => {
  const fieldAnswersHydrated: Map<
    string,
    { answers: UserFieldAnswerFragment[]; field: FieldFragment }
  > = new Map();

  request.flow.steps.forEach((step, index) => {
    step.response.fields.forEach((field) => {
      const fieldAnswers = request.steps[index].responseFieldAnswers.find(
        (responseField) => responseField.fieldId === field.fieldId,
      );
      if (!fieldAnswers) return;
      fieldAnswersHydrated.set(field.fieldId, { answers: fieldAnswers.answers, field });
    });
  });
 
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "36px",
      }}
    >
      {Array.from(fieldAnswersHydrated.values()).map(({ answers, field }) => (
        <UserFieldAnswers key={field.fieldId} field={field} fieldAnswers={answers} />
      ))}
    </Box>
  );
};

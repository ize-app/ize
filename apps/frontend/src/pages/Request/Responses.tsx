import { Box, Typography } from "@mui/material";

import { UserFieldAnswers } from "@/components/Field/UserFieldAnswers";
import { RequestFragment, ResponseFieldAnswersFragment } from "@/graphql/generated/graphql";

export const Responses = ({ request }: { request: RequestFragment }) => {
  const responseFieldAnswers: ResponseFieldAnswersFragment[] = [];

  request.requestSteps.forEach((step) => {
    responseFieldAnswers.push(...step.responseFieldAnswers);
  });

  const filteredResponseFieldAnswers = responseFieldAnswers.filter(
    (responseFieldAnswer) => responseFieldAnswer.answers.length > 0,
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "36px",
      }}
    >
      {filteredResponseFieldAnswers.length > 0 ? (
        filteredResponseFieldAnswers.map(({ answers, field }) => (
          <UserFieldAnswers key={field.fieldId} field={field} fieldAnswers={answers} />
        ))
      ) : (
        <Typography>No responses yet</Typography>
      )}
    </Box>
  );
};

import { Box, Typography } from "@mui/material";
import { AvatarWithName } from "@/components/Avatar";
import { FieldFragment, UserFieldAnswerFragment } from "@/graphql/generated/graphql";
import { Answer } from "./Answer";

export const UserFieldAnswer = ({
  userFieldAnswer,
  field,
}: {
  userFieldAnswer: UserFieldAnswerFragment;
  field: FieldFragment;
}) => {
  const createdAt = new Date(userFieldAnswer.createdAt).toLocaleDateString();
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <AvatarWithName avatar={userFieldAnswer.user} />
        <Typography variant="description" marginBottom={"4px"}>
          {createdAt}
        </Typography>
      </Box>
      <Answer field={field} fieldAnswer={userFieldAnswer.answer} />
    </Box>
  );
};

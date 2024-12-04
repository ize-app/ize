import { Box, Typography } from "@mui/material";

import { AvatarWithName } from "@/components/Avatar";
import { FieldFragment, UserFieldAnswerFragment } from "@/graphql/generated/graphql";

import { Value } from "../Value/Value";

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
        <AvatarWithName avatar={userFieldAnswer.creator} fontSize="14px" typography="description" />
        <Typography variant="description" marginBottom={"4px"}>
          {createdAt}
        </Typography>
      </Box>
      <Value value={userFieldAnswer.answer} field={field} type={"fieldAnswer"} />
    </Box>
  );
};

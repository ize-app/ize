import { Box, Button, Typography } from "@mui/material";
import { useContext, useState } from "react";

import { CurrentUserContext } from "@/contexts/current_user_context";
import {
  FieldFragment,
  UserFieldAnswerFragment,
  UserFieldAnswersFragment,
} from "@/graphql/generated/graphql";

import { UserFieldAnswer } from "./UserFieldAnswer";

export const UserFieldAnswers = ({
  userFieldAnswers,
  field,
}: {
  userFieldAnswers: UserFieldAnswersFragment;
  field: FieldFragment;
}) => {
  const { me } = useContext(CurrentUserContext);
  const [showAll, setShowAll] = useState<boolean>(false);
  const userAnswers: UserFieldAnswerFragment[] = [];
  const otherAnswers: UserFieldAnswerFragment[] = [];

  userFieldAnswers.answers.forEach((userFieldAnswer) => {
    if (userFieldAnswer.user.id === me?.user.id) {
      userAnswers.push(userFieldAnswer);
    } else {
      otherAnswers.push(userFieldAnswer);
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        padding: "12px",
        marginTop: "8px",
      }}
    >
      <Typography variant={"description"}>Responses</Typography>
      {userAnswers.map((userFieldAnswer, index) => (
        <UserFieldAnswer
          key={"userfieldAnswer" + index}
          userFieldAnswer={userFieldAnswer}
          field={field}
        />
      ))}
      {otherAnswers.map((userFieldAnswer, index) => (
        <UserFieldAnswer
          key={"userfieldAnswer" + index}
          userFieldAnswer={userFieldAnswer}
          field={field}
        />
      ))}
      {otherAnswers.length > 0 && !showAll && (
        <Button
          variant={"outlined"}
          color="secondary"
          size="small"
          sx={{ width: "40px" }}
          onClick={() => {
            setShowAll(true);
          }}
        >
          See all
        </Button>
      )}
    </Box>
  );
};

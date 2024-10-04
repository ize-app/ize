import { Box, Typography } from "@mui/material";
import { useContext } from "react";

import { FieldFragment, UserFieldAnswerFragment } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";

import { UserFieldAnswer } from "./UserFieldAnswer";

export const UserFieldAnswers = ({
  fieldAnswers,
  field,
}: {
  fieldAnswers: UserFieldAnswerFragment[];
  field: FieldFragment;
}) => {
  const { me } = useContext(CurrentUserContext);
  // const [showAll, setShowAll] = useState<boolean>(false);
  const userAnswers: UserFieldAnswerFragment[] = [];
  const otherAnswers: UserFieldAnswerFragment[] = [];

  fieldAnswers.forEach((userFieldAnswer) => {
    if (userFieldAnswer.creator.id === me?.user.id) {
      userAnswers.push(userFieldAnswer);
    } else {
      otherAnswers.push(userFieldAnswer);
    }
  });

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        padding: "12px",
        marginTop: "8px",
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        minWidth: "300px",
        maxWidth: "500px",
      })}
    >
      <Typography variant={"label"}>{field.name}</Typography>
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
      {/* {otherAnswers.length > 0 && !showAll && (
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
      )} */}
    </Box>
  );
};

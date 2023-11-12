import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { Response, Result } from "../../../graphql/generated/graphql";
import { colors } from "../../../style/style";

const FinalDecision = ({
  userResponse,
  result,
  expirationDate,
}: {
  userResponse: Response;
  result: Result | undefined;
  expirationDate: Date;
}) => {
  const now = new Date();
  const isExpired = now > expirationDate;

  return (
    <Paper
      color="palette.primary"
      sx={{
        backgroundColor: colors.primaryContainer,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "16px",
      }}
    >
      {result ? (
        <Typography>
          Final decision:{" "}
          <span style={{ fontWeight: 900 }}>{result.selectedOption.value}</span>
        </Typography>
      ) : isExpired ? (
        <Typography>Request expired without a decision</Typography>
      ) : null}
      {typeof result?.actionComplete === "boolean" ? (
        result.actionComplete ? (
          <Typography>Custom integration ran successfully</Typography>
        ) : (
          <Typography color="red">Custom integration failed ⚠️</Typography>
        )
      ) : null}
      {userResponse ? (
        <Typography>
          You responded:{" "}
          <span style={{ fontWeight: 900 }}>{userResponse.value}</span>
        </Typography>
      ) : (
        <Typography>You did not respond</Typography>
      )}
    </Paper>
  );
};

export default FinalDecision;

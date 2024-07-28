import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlined";
import { Button, Typography } from "@mui/material";

export const ResponseStatus = ({
  responseComplete,
  userResponded,
  userRespondPermission,
}: {
  responseComplete: boolean;
  userResponded: boolean;
  userRespondPermission: boolean;
}) => {
  if (responseComplete) return <Typography>Closed</Typography>;
  if (userResponded) return <CheckCircleIcon color={"success"} fontSize="small" />;
  return (
    <Button size="small" color="primary" variant="outlined" disabled={!userRespondPermission}>
      Respond
    </Button>
  );
};

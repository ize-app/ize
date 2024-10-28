import { useMutation } from "@apollo/client";
import AlarmIcon from "@mui/icons-material/Alarm";
import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { EndRequestStepDocument } from "@/graphql/generated/graphql";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";

export const EndRequestStepButton = ({ requestStepId }: { requestStepId: string }) => {
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);

  const navigate = useNavigate();
  const [mutate] = useMutation(EndRequestStepDocument, {
    variables: { requestStepId },
    onCompleted: (_data) => {
      navigate(0);
      // TODO: maybe add a 1 second timer here so that the user can see the success message
      setSnackbarOpen(true);
      setSnackbarData({ message: "Step ended", type: "success" });
    },
    onError: (_data) => {
      setSnackbarOpen(true);
      setSnackbarData({ message: "Error ending step early", type: "error" });
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Button
        color="warning"
        variant="outlined"
        endIcon={<AlarmIcon />}
        sx={{ width: "300px", boxShadow: "4px solid" }}
        onClick={async () => {
          await mutate();
        }}
      >
        End this collaborative step early
      </Button>
    </Box>
  );
};

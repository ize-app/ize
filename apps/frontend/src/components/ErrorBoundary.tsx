import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
  const error = useRouteError();
  console.log("ERROR: ", error);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" color={"primary"}>
          😭 Uh oh... 😭
        </Typography>
        <Typography variant="body1">
          Something has gone wrong. Message tyler@cults.app if you keep having the same issue.
        </Typography>
      </Box>
    </Box>
  );
};

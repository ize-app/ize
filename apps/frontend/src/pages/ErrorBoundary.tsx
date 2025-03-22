import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
  const error = useRouteError();

  useEffect(() => {
    if (error) {
      // If it's a specific route error, you can add context
      if (isRouteErrorResponse(error)) {
        Sentry.captureException(new Error(`Route error: ${error.status} - ${error.statusText}`), {
          extra: {
            status: error.status,
            statusText: error.statusText,
            data: error.data,
          },
        });
      } else {
        // Capture generic errors
        Sentry.captureException(error);
      }
    }
  }, [error]);

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
          Something has gone wrong. Message ize.inquiries@gmail.com if you keep having the same issue.
        </Typography>
      </Box>
    </Box>
  );
};

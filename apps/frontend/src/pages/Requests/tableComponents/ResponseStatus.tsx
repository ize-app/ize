import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlined";
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";

export const ResponseStatus = ({
  userResponded,
  responsePermission,
}: {
  userResponded: boolean;
  responsePermission: boolean;
}) => {
  const theme = useTheme();
  const isSmallScreenSize = useMediaQuery(theme.breakpoints.up("sm"));
  // if (userResponded) return <CheckCircleIcon color={"success"} fontSize="small" />;
  if (userResponded)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          width: "74px",
        }}
      >
        <CheckCircleIcon color={"success"} fontSize="small" />
        <Typography
          variant="description"
          fontSize={".75rem"}
          color={(theme) => theme.palette.success.main}
        >
          Responded
        </Typography>
      </Box>
    );

  return (
    isSmallScreenSize && (
      <Button
        size="small"
        color="primary"
        variant="outlined"
        disabled={!responsePermission}
        sx={{ alignSelf: "center", width: "74px" }}
      >
        Respond
      </Button>
    )
  );
};

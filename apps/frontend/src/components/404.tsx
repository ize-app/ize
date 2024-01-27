import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const _404 = () => (
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
        😭 404 😭
      </Typography>
      <Typography variant="body1">
        This isn't a valid URL. Check your URL and try again :) If you keep having the same issue,
        feel free to message tyler@ize.space
      </Typography>
    </Box>
  </Box>
);

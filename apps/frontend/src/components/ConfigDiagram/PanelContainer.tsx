import Box from "@mui/material/Box";

export const PanelContainer = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={(theme) => ({
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      height: "100%",
      width: "50%",
      display: "flex",
      flexDirection: "column",
      border: "1px solid white",
      backgroundColor: "#fffbff",
    })}
  >
    {children}
  </Box>
);

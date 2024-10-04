import Box from "@mui/material/Box";

export const PanelContainer = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </Box>
);

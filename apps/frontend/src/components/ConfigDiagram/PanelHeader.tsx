import Box from "@mui/material/Box";

export const PanelHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "40px",
        display: "flex",
        alignItems: "center",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        padding: "1rem",
      }}
    >
      {children}
    </Box>
  );
};

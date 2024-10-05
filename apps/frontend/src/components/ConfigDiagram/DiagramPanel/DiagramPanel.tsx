import Box from "@mui/material/Box";

export const DiagramPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        padding: "60px 24px",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  );
};

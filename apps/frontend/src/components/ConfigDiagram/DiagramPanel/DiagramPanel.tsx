import Box from "@mui/material/Box";

export const DiagramPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        height: "100%",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        padding: "48px 0px",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  );
};

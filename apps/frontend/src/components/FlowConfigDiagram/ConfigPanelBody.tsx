import Box from "@mui/material/Box";

export const ConfigPanelBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        height: "100%",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
      }}
    >
      {children}
    </Box>
  );
};

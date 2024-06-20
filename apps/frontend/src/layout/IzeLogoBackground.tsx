import Box from "@mui/material/Box";

export const IzeLogoBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url(./ize-repeat.svg)",
        backgroundSize: "300px",
      }}
    >
      {children}
    </Box>
  );
};

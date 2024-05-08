import Box from "@mui/material/Box";

export const ConfigDiagramContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
        },
        flexDirection: "row",
        width: "100%",
        height: "100%",
        minWidth: "300px",
      })}
    >
      {children}
    </Box>
  );
};

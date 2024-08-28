import { Box, Fade } from "@mui/material";

export const FieldBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>{children}</Box>
    </Fade>
  );
};

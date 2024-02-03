import Box from "@mui/material/Box";
import { ReactNode } from "react";

export const ResponsiveFormRow = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        gap: "24px",
        justifyContent: "flex-start",
        flexWrap: "wrap",
      }}
    >
      {children}
    </Box>
  );
};

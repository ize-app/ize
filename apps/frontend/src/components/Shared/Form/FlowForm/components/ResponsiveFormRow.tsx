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
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {children}
    </Box>
  );
};

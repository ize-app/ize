import { Box } from "@mui/material";
import { ReactNode } from "react";

export const FieldOptionsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      component="ul"
      sx={{
        borderRadius: "4px",
        // outline: "1px solid rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        marginBlockStart: "0px",
        marginBlockEnd: "0px",
        paddingInlineStart: "0px",
        listStyleType: "none",
        backgroundColor: "white",
        // "& li": { borderBottom: "1px solid rgba(0, 0, 0, 0.1)" },
      }}
    >
      {children}
    </Box>
  );
};

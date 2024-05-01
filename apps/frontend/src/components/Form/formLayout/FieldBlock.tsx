import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

export const FieldBlock = ({ children, sx }: { children: ReactNode; sx?: SxProps }) => {
  const defaultStyles: SxProps = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };
  const styles = { ...defaultStyles, ...(sx ?? {}) } as SxProps;
  return <Box sx={styles}>{children}</Box>;
};

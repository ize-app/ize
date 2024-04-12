import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

export const ResponsiveFormRow = ({ children, sx }: { children: ReactNode; sx?: SxProps }) => {
  const defaultStyles: SxProps = {
    width: "100%",
    display: "flex",
    gap: "24px",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    flexWrap: "wrap",
  };
  const styles = { ...defaultStyles, ...(sx ?? {}) } as SxProps;
  return <Box sx={styles}>{children}</Box>;
};

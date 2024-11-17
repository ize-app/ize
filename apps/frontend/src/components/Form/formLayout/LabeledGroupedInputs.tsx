import { SxProps, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

const LabeledWrapper = ({ label, children }: { label?: string; children: ReactNode }) => {
  return !label ? (
    <>{children}</>
  ) : (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", flex: 1, minWidth: 0 }}>
      <Typography variant="description" component="legend" fontWeight={400}>
        {label}
      </Typography>
      {children}
    </Box>
  );
};

export const LabeledGroupedInputs = ({
  label,
  children,
  sx = {},
}: {
  label?: string;
  children: ReactNode;
  sx?: SxProps;
}) => {
  const defaultStyles: SxProps = {
    flex: 1,
    minWidth: 0,
    border: "solid 1px",
    borderColor: "rgba(0, 0, 0, 0.23)",
    borderRadius: "4px",
    position: "relative",
    // overflowX: "hidden",
  };
  const styles = { ...defaultStyles, ...(sx ?? {}) } as SxProps;
  return (
    <LabeledWrapper label={label}>
      <Box sx={styles}>{children}</Box>
    </LabeledWrapper>
  );
};

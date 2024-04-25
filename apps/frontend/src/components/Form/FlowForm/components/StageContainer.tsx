import { Box, FormHelperText, Paper, SxProps, Typography } from "@mui/material";

interface StageContainerProps {
  label: string;
  children?: React.ReactNode;
  sx?: SxProps;
  hasError?: boolean;
  onClick: () => void;
}

export const StageContainer = ({
  label,
  children,
  hasError = false,
  onClick,
  sx = {},
}: StageContainerProps) => {
  return (
    <Paper
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid",
        borderColor: hasError ? "red" : "primary",
        width: "200px",
        height: "40px",
        ...sx,
      }}
    >
      <Typography color="primary">{label}</Typography>
      {children}
      <FormHelperText
        sx={{
          color: "error.main",
        }}
      >
        {hasError ? "Error in this step" : null}
      </FormHelperText>
    </Paper>
  );
};

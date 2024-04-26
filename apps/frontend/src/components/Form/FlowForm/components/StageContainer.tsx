import { FormHelperText, Paper, SxProps, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface StageContainerProps {
  label: string;
  id: string;
  children?: React.ReactNode;
  sx?: SxProps;
  hasError?: boolean;
  setSelectedId: Dispatch<SetStateAction<string | false>>;
  selectedId: string | false;
}

export const StageContainer = ({
  label,
  id,
  children,
  setSelectedId,
  selectedId,
  hasError = false,
  sx = {},
}: StageContainerProps) => {
  const isSelected = selectedId === id;
  return (
    <Paper
      onClick={() => {
        setSelectedId(id);
      }}
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
      {isSelected && "selected"}
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

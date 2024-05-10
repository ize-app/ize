import { Chip } from "@mui/material";
import { actionExecutionStatusProps } from "./actionExecutionProps";
import { ActionExecutionStatus } from "@/graphql/generated/graphql";

export const ActionExecutionStatusTag = ({ status }: { status: ActionExecutionStatus }) => {
  return (
    <Chip
      label={actionExecutionStatusProps[status].label}
      sx={{
        backgroundColor: actionExecutionStatusProps[status].backgroundColor,
        color: actionExecutionStatusProps[status].color,
      }}
      size="small"
    />
  );
};

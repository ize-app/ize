import { Chip } from "@mui/material";
import { Status } from "@/graphql/generated/graphql";
import { statusProps } from "./statusProps";

export const StatusTag = ({ status }: { status: Status }) => {
  return (
    <Chip
      label={statusProps[status].label}
      sx={{
        backgroundColor: statusProps[status].backgroundColor,
        color: statusProps[status].color,
      }}
      size="small"
    />
  );
};

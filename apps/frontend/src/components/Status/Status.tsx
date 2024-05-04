import { Chip } from "@mui/material";
import { Status } from "./type";
import { getStatusTitle } from "./getStatusTitle";
import { getStatusColor } from "./getStatusColor";

export const StatusTag = ({ status }: { status: Status }) => {
  return (
    <Chip
      label={getStatusTitle(status)}
      sx={{ backgroundColor: getStatusColor(status) }}
      size="small"
    />
  );
};

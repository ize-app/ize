import { Chip } from "@mui/material";
import { RequestStatus } from "./type";
import { requestStatusProps } from "./requestStatusProps";

export const RequestStatusTag = ({ status }: { status: RequestStatus }) => {
  return (
    <Chip
      label={requestStatusProps[status].label}
      sx={{
        backgroundColor: requestStatusProps[status].backgroundColor,
        color: requestStatusProps[status].color,
      }}
      size="small"
    />
  );
};

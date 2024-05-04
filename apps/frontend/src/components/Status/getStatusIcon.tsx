import { getStatusColor } from "./getStatusColor";
import { Status } from "./type";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import { ReactElement } from "react";

export const getStatusIcon = (status: Status): ReactElement => {
  switch (status) {
    case Status.Pending:
      return (
        <RadioButtonUncheckedOutlinedIcon
          fontSize={"medium"}
          sx={{ color: getStatusColor(status) }}
        />
      );
    case Status.InProgress:
      return <TimerOutlinedIcon fontSize={"medium"} sx={{ color: getStatusColor(status) }} />;
    case Status.Completed:
      return (
        <CheckCircleOutlineOutlinedIcon
          fontSize={"medium"}
          sx={{ color: getStatusColor(status) }}
        />
      );
    default:
      return (
        <HourglassTopOutlinedIcon fontSize={"medium"} sx={{ color: getStatusColor(status) }} />
      );
  }
};

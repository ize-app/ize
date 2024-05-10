import { RequestStatus } from "./type";
import muiTheme from "@/style/muiTheme";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import { SvgIconProps } from "@mui/material";

type RequestStatusProps = {
  [key in RequestStatus]: {
    color: string;
    backgroundColor: string;
    label: string;
    icon: React.ComponentType<SvgIconProps>;
  };
};

export const requestStatusProps: RequestStatusProps = {
  [RequestStatus.Completed]: {
    color: "white",
    backgroundColor: muiTheme.palette.success.main,
    label: "Completed",
    icon: CheckCircleOutlineOutlinedIcon,
  },
  [RequestStatus.InProgress]: {
    color: "white",
    backgroundColor: muiTheme.palette.info.main,
    label: "In progress",
    icon: HourglassTopOutlinedIcon,
  },
  [RequestStatus.Pending]: {
    color: "black",
    backgroundColor: muiTheme.palette.grey[400],
    label: "Pending",
    icon: RadioButtonUncheckedOutlinedIcon,
  },
};

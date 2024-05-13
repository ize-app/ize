import { Status } from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { SvgIconProps } from "@mui/material";

type RequestStatusProps = {
  [key in Status]: {
    color: string;
    backgroundColor: string;
    label: string;
    icon: React.ComponentType<SvgIconProps>;
  };
};

export const statusProps: RequestStatusProps = {
  [Status.Completed]: {
    color: "white",
    backgroundColor: muiTheme.palette.success.main,
    label: "Completed",
    icon: CheckCircleOutlineOutlinedIcon,
  },
  [Status.InProgress]: {
    color: "white",
    backgroundColor: muiTheme.palette.info.main,
    label: "In progress",
    icon: HourglassTopOutlinedIcon,
  },
  [Status.NotAttempted]: {
    color: "black",
    backgroundColor: muiTheme.palette.grey[400],
    label: "Pending",
    icon: RadioButtonUncheckedOutlinedIcon,
  },
  [Status.Failure]: {
    color: "white",
    backgroundColor: muiTheme.palette.error.main,
    label: "Error",
    icon: CloseIcon,
  },
};

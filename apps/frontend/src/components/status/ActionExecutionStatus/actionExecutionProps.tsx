import { ActionExecutionStatus } from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";
import { SvgIconProps } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import CloseIcon from "@mui/icons-material/Close";

type ActionExecutionStatusProps = {
  [key in ActionExecutionStatus]: {
    color: string;
    backgroundColor: string;
    label: string;
    icon: React.ComponentType<SvgIconProps>;
  };
};

export const actionExecutionStatusProps: ActionExecutionStatusProps = {
  [ActionExecutionStatus.Completed]: {
    color: "white",
    backgroundColor: muiTheme.palette.success.main,
    label: "Completed",
    icon: CheckCircleOutlineOutlinedIcon,
  },
  [ActionExecutionStatus.Failure]: {
    color: "white",
    backgroundColor: muiTheme.palette.error.main,
    label: "Error",
    icon: CloseIcon,
  },
  [ActionExecutionStatus.NotAttempted]: {
    color: "black",
    backgroundColor: muiTheme.palette.grey[400],
    label: "Not started",
    icon: RadioButtonUncheckedOutlinedIcon,
  },
  [ActionExecutionStatus.InProgress]: {
    color: "white",
    backgroundColor: muiTheme.palette.info.main,
    label: "In progress",
    icon: HourglassTopOutlinedIcon,
  },
};

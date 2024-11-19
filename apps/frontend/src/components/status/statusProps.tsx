import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import { SvgIconProps } from "@mui/material";

import { Status } from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";

export interface StatusProps {
  color: string;
  label: string;
  icon: React.ComponentType<SvgIconProps> | null;
}

type GenericStatusProps = {
  [key in Status]: StatusProps;
};

export const genericStatusProps: GenericStatusProps = {
  [Status.Completed]: {
    color: muiTheme.palette.success.main,
    label: "Completed",
    icon: CheckCircleOutlineOutlinedIcon,
  },
  [Status.InProgress]: {
    color: muiTheme.palette.info.main,
    label: "In progress",
    icon: HourglassTopOutlinedIcon,
  },
  [Status.NotAttempted]: {
    color: muiTheme.palette.grey[700],
    label: "Pending",
    icon: RadioButtonUncheckedOutlinedIcon,
  },
  [Status.Failure]: {
    color: muiTheme.palette.error.main,
    label: "Error",
    icon: CloseIcon,
  },
  [Status.Cancelled]: {
    color: muiTheme.palette.grey[400],
    label: "Cancelled",
    icon: CloseIcon,
  },
};

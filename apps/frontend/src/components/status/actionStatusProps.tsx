import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ConstructionIcon from "@mui/icons-material/Construction";

import { ActionStatus } from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";

import { StatusProps } from "./statusProps";

type ActionStatusProps = {
  [key in ActionStatus]: StatusProps;
};

export const actionStatusProps: ActionStatusProps = {
  [ActionStatus.Attempting]: {
    color: muiTheme.palette.warning.main,
    label: "Executing action",
    icon: ConstructionIcon,
  },

  [ActionStatus.DidNotPassFilter]: {
    color: muiTheme.palette.error.main,
    label: "Did not pass filter",
    icon: CloseIcon,
  },
  [ActionStatus.Complete]: {
    color: muiTheme.palette.success.main,
    label: "Completed",
    icon: CheckCircleOutlineOutlinedIcon,
  },
  [ActionStatus.NotStarted]: {
    color: muiTheme.palette.grey[700],
    label: "Pending",
    icon: null,
  },
  [ActionStatus.Error]: {
    color: muiTheme.palette.error.main,
    label: "Error",
    icon: CloseIcon,
  },
};

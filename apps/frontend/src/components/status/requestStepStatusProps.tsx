import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ConstructionIcon from "@mui/icons-material/Construction";
import HourglassTopOutlinedIcon from "@mui/icons-material/HourglassTopOutlined";

import { RequestStepStatus } from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";

import { StatusProps } from "./statusProps";

type RequestStepStatusProps = {
  [key in RequestStepStatus]: StatusProps;
};

export const requestStepStatusProps: RequestStepStatusProps = {
  [RequestStepStatus.CollectingResponses]: {
    color: muiTheme.palette.info.main,
    label: "Collecting responses",
    icon: HourglassTopOutlinedIcon,
  },
  [RequestStepStatus.Complete]: {
    color: muiTheme.palette.success.main,
    label: "Completed",
    icon: CheckCircleOutlineOutlinedIcon,
  },
  [RequestStepStatus.CreatingResult]: {
    color: muiTheme.palette.warning.light,
    label: "Creating results",
    icon: ConstructionIcon,
  },
  [RequestStepStatus.ExecutingAction]: {
    color: muiTheme.palette.warning.light,
    label: "Executing action",
    icon: ConstructionIcon,
  },
  [RequestStepStatus.Error]: {
    color: muiTheme.palette.error.main,
    label: "Error",
    icon: CloseIcon,
  },
  [RequestStepStatus.NotStarted]: {
    color: muiTheme.palette.grey[700],
    label: "Pending",
    icon: null,
  },
};

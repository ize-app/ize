import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ConstructionIcon from "@mui/icons-material/Construction";

import { ResultGroupStatus } from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";

import { StatusProps } from "./statusProps";

type ResultGroupStatusProps = {
  [key in ResultGroupStatus]: StatusProps;
};

export const resultGroupStatusProps: ResultGroupStatusProps = {
  [ResultGroupStatus.Attempting]: {
    color: muiTheme.palette.warning.main,
    label: "Executing action",
    icon: ConstructionIcon,
  },
  [ResultGroupStatus.Error]: {
    color: muiTheme.palette.error.main,
    label: "Error",
    icon: CloseIcon,
  },
  [ResultGroupStatus.FinalNoResult]: {
    color: muiTheme.palette.success.main,
    label: "Completed without result",
    icon: CheckCircleOutlineOutlinedIcon,
  },
  [ResultGroupStatus.FinalResult]: {
    color: muiTheme.palette.success.main,
    label: "Completed",
    icon: CheckCircleOutlineOutlinedIcon,
  },
  [ResultGroupStatus.NotStarted]: {
    color: muiTheme.palette.grey[700],
    label: "Pending",
    icon: null,
  },
};

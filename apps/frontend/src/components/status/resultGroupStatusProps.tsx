import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ConstructionIcon from "@mui/icons-material/Construction";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { ResultGroupStatus } from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";

import { StatusProps } from "./statusProps";

type ResultGroupStatusProps = {
  [key in ResultGroupStatus]: StatusProps;
};

export const resultGroupStatusProps: ResultGroupStatusProps = {
  [ResultGroupStatus.Attempting]: {
    color: muiTheme.palette.warning.light,
    lightColor: "#fff5ed",
    label: "Creating result",
    icon: ConstructionIcon,
  },
  [ResultGroupStatus.Error]: {
    color: muiTheme.palette.error.main,
    lightColor: "#f5cdcb",
    label: "Error",
    icon: CloseIcon,
  },
  [ResultGroupStatus.FinalNoResult]: {
    // color: muiTheme.palette.success.main,
    // lightColor: "#d0f2d2",
    color: muiTheme.palette.warning.light,
    lightColor: "#fff5ed",
    label: "Completed without result",
    icon: WarningAmberIcon,
  },
  [ResultGroupStatus.FinalResult]: {
    color: muiTheme.palette.success.main,
    lightColor: "#d0f2d2",
    label: "Completed",
    icon: CheckCircleOutlineOutlinedIcon,
  },
  [ResultGroupStatus.NotStarted]: {
    color: muiTheme.palette.grey[700],
    lightColor: muiTheme.palette.grey[100],
    label: "Pending",
    icon: null,
  },
  [ResultGroupStatus.Preliminary]: {
    color: muiTheme.palette.grey[700],
    lightColor: muiTheme.palette.grey[100],
    label: "Pending",
    icon: null,
  },
};

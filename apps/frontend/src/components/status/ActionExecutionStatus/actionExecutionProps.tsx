import { ActionExecutionStatus } from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";

type ActionExecutionStatusProps = {
  [key in ActionExecutionStatus]: {
    color: string;
    backgroundColor: string;
    label: string;
  };
};

export const actionExecutionStatusProps: ActionExecutionStatusProps = {
  [ActionExecutionStatus.Completed]: {
    color: "white",
    backgroundColor: muiTheme.palette.success.main,
    label: "Completed",
  },
  [ActionExecutionStatus.Failure]: {
    color: "white",
    backgroundColor: muiTheme.palette.error.main,
    label: "Error",
  },
  [ActionExecutionStatus.NotAttempted]: {
    color: "black",
    backgroundColor: muiTheme.palette.grey[400],
    label: "Not started",
  },
};

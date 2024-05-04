import { Status } from "./type";
import muiTheme from "@/style/muiTheme";

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case Status.Pending:
      return muiTheme.palette.grey[300];
    case Status.InProgress:
      return muiTheme.palette.info.main;
    case Status.Completed:
      return muiTheme.palette.success.main;
  }
};

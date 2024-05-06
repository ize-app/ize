import { Status } from "./type";

export const getStatusTitle = (status: Status): string => {
  switch (status) {
    case Status.Pending:
      return "Pending";
    case Status.InProgress:
      return "In progress";
    case Status.Completed:
      return "Completed";
  }
};

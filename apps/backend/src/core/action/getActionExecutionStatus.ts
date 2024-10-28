import { Status } from "@/graphql/generated/resolver-types";

import { ActionExecutionPrismaType } from "./actionPrismaTypes";

export const getActionExecutionStatus = (
  actionExecution: ActionExecutionPrismaType | undefined,
  requestFinal: boolean,
) => {
  if (actionExecution && actionExecution.complete) return Status.Completed;
  else if (actionExecution && !actionExecution.complete) return Status.Failure;
  else if (!actionExecution && requestFinal) return Status.Cancelled;
  else return Status.NotAttempted;
};

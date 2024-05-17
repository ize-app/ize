import {
  ActionExecutionFragment,
  Status,
  ActionFragment,
  ActionType,
  FieldDataType,
} from "@/graphql/generated/graphql";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataTable } from "@/components/Tables/DataTable/DataTable";
import { renderFreeInputValue } from "../Field/renderFreeInputValue";
import { StatusTag } from "../status/StatusTag";

export const ActionExecution = ({
  action,
  actionExecution,
}: {
  action: ActionFragment;
  actionExecution: ActionExecutionFragment | null;
}) => {
  const data = [
    {
      label: "Status",
      value: <StatusTag status={actionExecution ? actionExecution.status : Status.NotAttempted} />,
    },
  ];

  if (actionExecution?.lastAttemptedAt)
    data.push({
      label: actionExecution.status === Status.Completed ? "Completed at" : "Last attempted at",
      value: <Typography>{new Date(actionExecution.lastAttemptedAt).toLocaleString()}</Typography>,
    });

  switch (action.__typename) {
    case ActionType.CallWebhook: {
      data.unshift(
        {
          label: "Webhook integration",
          value: renderFreeInputValue(action.uri, FieldDataType.Uri, "1rem"),
        },
        {
          label: "What this webhook does",
          value: <Typography>{action.name}</Typography>,
        },
        {
          label: "Status",
          value: (
            <StatusTag status={actionExecution ? actionExecution.status : Status.NotAttempted} />
          ),
        },
      );
      break;
    }
    case ActionType.EvolveFlow: {
      break;
    }
    default:
      break;
  }
  return (
    <Box>
      <DataTable data={data} ariaLabel="Action status table" />
    </Box>
  );
};

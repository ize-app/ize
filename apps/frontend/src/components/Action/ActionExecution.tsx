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
  switch (action.__typename) {
    case ActionType.CallWebhook: {
      const data = [
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
          value: actionExecution ? <StatusTag status={actionExecution.status} /> : <div>sdf</div>,
        },
      ];
      if (actionExecution?.lastAttemptedAt)
        data.push({
          label: actionExecution.status === Status.Completed ? "Completed at" : "Last attempted at",
          value: (
            <Typography>{new Date(actionExecution.lastAttemptedAt).toLocaleString()}</Typography>
          ),
        });
      return (
        <Box>
          <DataTable data={data} ariaLabel="Webhook context table" />
        </Box>
      );
    }
    case ActionType.EvolveFlow: {
      return (
        <>
          <Typography>Evolve flow</Typography>
        </>
      );
    }
    default:
  }
};

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { DataTable } from "@/components/Tables/DataTable/DataTable";
import {
  ActionExecutionFragment,
  ActionFragment,
  ActionStatus,
  ActionType,
  FieldDataType,
} from "@/graphql/generated/graphql";

import { FreeInputValue } from "../Field/FreeInputValue";
import { actionStatusProps } from "../status/actionStatusProps";
import { StatusTag } from "../status/StatusTag";

export const ActionExecution = ({
  action,
  actionExecution,
}: {
  action: ActionFragment;
  actionExecution: ActionExecutionFragment | null;
}) => {
  const statusProps = actionStatusProps[actionExecution?.status ?? ActionStatus.NotStarted];

  const data = [
    {
      label: "Status",
      value: <StatusTag statusProps={statusProps} />,
    },
  ];

  if (actionExecution?.lastAttemptedAt)
    data.push({
      label: statusProps.label,
      value: <Typography>{new Date(actionExecution.lastAttemptedAt).toLocaleString()}</Typography>,
    });

  switch (action.__typename) {
    case ActionType.CallWebhook: {
      data.unshift(
        {
          label: "Webhook integration",
          value: <FreeInputValue value={action.uri} type={FieldDataType.Uri} />,
        },
        {
          label: "What this webhook does",
          value: <Typography>{action.webhookName}</Typography>,
        },
        {
          label: "Status",
          value: <StatusTag statusProps={statusProps} />,
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

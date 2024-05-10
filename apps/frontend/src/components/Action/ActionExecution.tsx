import { ActionFragment, ActionType, FieldDataType } from "@/graphql/generated/graphql";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataTable } from "@/components/Tables/DataTable/DataTable";
import { renderFreeInputValue } from "../Field/renderFreeInputValue";
import { RequestStatusTag } from "../status/RequestStatusTag";
import { RequestStatus } from "../status/type";

export const ActionExecution = ({ action }: { action: ActionFragment }) => {
  switch (action.__typename) {
    case ActionType.CallWebhook: {
      return (
        <Box>
          <DataTable
            data={[
              {
                label: "Webhook integration",
                value: renderFreeInputValue(action.uri, FieldDataType.Uri),
              },
              {
                label: "What this webhook does",
                value: <Typography>{action.name}</Typography>,
              },
              {
                label: "Status",
                value: <RequestStatusTag status={RequestStatus.Completed} />,
              },
            ]}
            ariaLabel="Webhook context table"
          />
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

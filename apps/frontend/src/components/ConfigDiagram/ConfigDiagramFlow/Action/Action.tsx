import { ActionFragment, ActionType } from "@/graphql/generated/graphql";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataTable } from "@/components/Tables/DataTable/DataTable";

export const Action = ({ action }: { action: ActionFragment }) => {
  switch (action.__typename) {
    case ActionType.CallWebhook: {
      return (
        <Box>
          <Typography>Call Webhook</Typography>
          <DataTable
            data={[
              { label: "Uri", value: <Typography>{action.uri}</Typography> },
              { label: "Name", value: <Typography>{action.name}</Typography> },
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

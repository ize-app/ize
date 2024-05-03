import { ActionFragment, ActionType } from "@/graphql/generated/graphql";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const Action = ({ action }: { action: ActionFragment }) => {
  switch (action.__typename) {
    case ActionType.CallWebhook: {
      return (
        <Box>
          <Typography>Call Webhook</Typography>
          <Typography>{action.uri}</Typography>
          <Typography>{action.name}</Typography>
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
      return null;
  }
};

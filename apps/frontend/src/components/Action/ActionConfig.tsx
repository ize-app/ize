import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { DataTable } from "@/components/Tables/DataTable/DataTable";
import { ActionFragment, ActionType, FieldDataType } from "@/graphql/generated/graphql";

import { renderFreeInputValue } from "../Field/renderFreeInputValue";

export const ActionConfig = ({ action }: { action: ActionFragment }) => {
  switch (action.__typename) {
    case ActionType.CallWebhook: {
      return (
        <Box>
          <DataTable
            data={[
              {
                label: "Webhook integration",
                value: renderFreeInputValue(action.uri, FieldDataType.Uri, "1rem"),
              },
              { label: "What this webhook does", value: <Typography>{action.name}</Typography> },
            ]}
            ariaLabel="Webhook context table"
          />
        </Box>
      );
    }
    case ActionType.EvolveFlow: {
      return (
        <>
          <Typography>The flow is updated to use the proposed flow version.</Typography>
        </>
      );
    }
    case ActionType.GroupUpdateMetadata: {
      return (
        <>
          <Typography>The group&apos;s metadata is updated to use the proposed values.</Typography>
        </>
      );
    }
    case ActionType.GroupUpdateMembership: {
      return (
        <>
          <Typography>The group&apos;s membership rules are updated.</Typography>
        </>
      );
    }
    default:
  }
};

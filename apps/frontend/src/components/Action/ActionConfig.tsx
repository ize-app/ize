import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { DataTable } from "@/components/Tables/DataTable/DataTable";
import {
  ActionFragment,
  ActionType,
  EntitySummaryPartsFragment,
  FieldDataType,
} from "@/graphql/generated/graphql";

import { renderFreeInputValue } from "../Field/renderFreeInputValue";

export const ActionConfig = ({
  action,
  group,
}: {
  action: ActionFragment;
  group: EntitySummaryPartsFragment | null | undefined;
}) => {
  const groupName = group?.name ?? "the group";
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
          <Typography>Metadata of {groupName} is updated to use the proposed values.</Typography>
        </>
      );
    }
    case ActionType.GroupUpdateMembership: {
      return (
        <>
          <Typography>
            Membership rules for {groupName} are updated. When a flow gives someone request/respond
            permissions to {groupName}, anyone who meets the new membership critieria will be able
            to request/respond.
          </Typography>
        </>
      );
    }
    case ActionType.GroupWatchFlow: {
      return (
        <>
          <Typography>
            The list of flows that {groupName} watches is updated. Group notifications will be sent
            out for activity on the new list of watched flows.
          </Typography>
        </>
      );
    }

    default:
  }
};

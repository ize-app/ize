import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { DataTable } from "@/components/Tables/DataTable/DataTable";
import { ActionFragment, ActionType, FieldDataType } from "@/graphql/generated/graphql";

import { renderFreeInputValue } from "../Field/renderFreeInputValue";

export const ActionDescription = ({
  actionType,
  groupName,
  action,
}: {
  actionType: ActionType;
  groupName?: string | null | undefined;
  action?: ActionFragment | null | undefined;
}) => {
  const groupNameOverride = groupName ?? "the group";

  switch (actionType) {
    case ActionType.CallWebhook: {
      if (action && action.__typename === ActionType.CallWebhook) {
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
      } else {
        return (
          <>
            <Typography>
              This webhook is called at the end of this flow. The webhook includes data on the
              request and results.
            </Typography>
          </>
        );
      }
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
          <Typography>
            Metadata of {groupNameOverride} is updated to use the proposed values.
          </Typography>
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

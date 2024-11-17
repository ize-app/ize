import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { DataTable } from "@/components/Tables/DataTable/DataTable";
import { ActionFragment, ActionType, FieldDataType } from "@/graphql/generated/graphql";

import { FreeInputValue } from "../Field/FreeInputValue";

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
                  value: <FreeInputValue value={action.uri} type={FieldDataType.Uri} />,
                },
                {
                  label: "What this webhook does",
                  value: <Typography>{action.webhookName}</Typography>,
                },
              ]}
              ariaLabel="Webhook context table"
            />
          </Box>
        );
      } else {
        return (
          <>
            <Typography>
              This action calls a webhook. The webhook includes data on the request and results.
            </Typography>
          </>
        );
      }
    }
    case ActionType.EvolveFlow: {
      return (
        <>
          <Typography>This action updates a flow to use the proposed flow version.</Typography>
        </>
      );
    }
    case ActionType.GroupWatchFlow: {
      return (
        <>
          <Typography>
            This action updates the of flows that <strong>{groupNameOverride}</strong> watches.{" "}
            <br />
            <br />
            When a group watches a flow, requests for those flows will show up on the group&apos;s
            page and the home page of anyone watching that group.
          </Typography>
        </>
      );
    }
    case ActionType.EvolveGroup: {
      return (
        <>
          <Typography>
            Updates membership and notificaiton settings for <strong>{groupNameOverride}</strong>.
          </Typography>
        </>
      );
    }

    default:
      return null;
  }
};

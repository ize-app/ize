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
    case ActionType.GroupUpdateMetadata: {
      return (
        <>
          <Typography>
            This action udpates the name and/or description of <strong>{groupNameOverride}</strong>.
          </Typography>
        </>
      );
    }
    case ActionType.GroupUpdateMembership: {
      return (
        <>
          <Typography>
            This action updates the membership of <strong>{groupNameOverride}</strong>. <br />
            <br />
            When a flow gives someone request/respond permissions to{" "}
            <strong>{groupNameOverride}</strong>, anyone who meets the new membership critieria will
            be able to request/respond.
          </Typography>
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
    case ActionType.GroupUpdateNotifications: {
      return (
        <>
          <Typography>
            This action changes how and where notifications are sent for flows that{" "}
            <strong>{groupNameOverride}</strong> watches.
          </Typography>
        </>
      );
    }

    default:
      return null;
  }
};

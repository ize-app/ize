import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CloseIcon from "@mui/icons-material/Close";
import DataObjectIcon from "@mui/icons-material/DataObject";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import WebhookIcon from "@mui/icons-material/Webhook";
import { SvgIconProps } from "@mui/material";

import { ActionType } from "@/graphql/generated/graphql";

type ActionProps = {
  [key in ActionType]: {
    label: string;
    icon: React.ComponentType<SvgIconProps>;
  };
};

export const actionProperties: ActionProps = {
  [ActionType.CallWebhook]: {
    label: "Call webhook",
    icon: WebhookIcon,
  },
  [ActionType.EvolveFlow]: {
    label: "Evolve this flow",
    icon: PublishedWithChangesIcon,
  },
  [ActionType.TriggerStep]: {
    label: "Trigger a new step",
    icon: ArrowCircleRightIcon,
  },
  [ActionType.GroupUpdateMetadata]: {
    label: "Update group metadata",
    icon: DataObjectIcon,
  },
  [ActionType.None]: {
    label: "None",
    icon: CloseIcon,
  },
};

import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import BoltIcon from "@mui/icons-material/Bolt";
import CloseIcon from "@mui/icons-material/Close";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
    icon: BoltIcon,
  },
  [ActionType.EvolveFlow]: {
    label: "Evolve this flow",
    icon: PublishedWithChangesIcon,
  },
  [ActionType.TriggerStep]: {
    label: "Trigger a new step",
    icon: ArrowCircleRightIcon,
  },
  [ActionType.GroupWatchFlow]: {
    label: "Watch/unwatch flow",
    icon: VisibilityIcon,
  },
  [ActionType.None]: {
    label: "None",
    icon: CloseIcon,
  },
  [ActionType.EvolveGroup]: {
    label: "Evolve group",
    icon: PublishedWithChangesIcon,
  },
};

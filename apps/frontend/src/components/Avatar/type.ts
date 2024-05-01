import { EntityFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";
import { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";

export interface AvatarProps extends MuiAvatarProps {
  avatar: EntityFragment | UserSummaryPartsFragment;
  size?: string;
}

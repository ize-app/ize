import { SxProps } from "@mui/material";
import MuiAvatar, { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import Blockies from "react-blockies";

import { EntityFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";

import { getAvatarString } from "./getAvatarString";
import { stringToColor } from "./stringToColor";

export interface AvatarProps extends MuiAvatarProps {
  avatar: EntityFragment | UserSummaryPartsFragment;
  size?: string;
}

export const Avatar = ({ avatar, size, ...props }: AvatarProps) => {
  const { sx } = props ?? {};
  const defaultStyles: SxProps = {
    bgcolor: stringToColor(avatar.id),
    width: size ?? "24px",
    height: size ?? "24px",
    fontSize: size ? parseInt(size, 10) / 2 : "12px",
  };
  return (
    <MuiAvatar
      src={avatar.icon ?? ""}
      alt={avatar.name}
      {...props}
      sx={{ ...defaultStyles, ...sx }}
    >
      {avatar.__typename === "Identity" &&
      avatar.identityType.__typename === "IdentityBlockchain" ? (
        <Blockies seed={avatar.identityType.address} />
      ) : (
        getAvatarString(avatar.name.toUpperCase())
      )}
    </MuiAvatar>
  );
};

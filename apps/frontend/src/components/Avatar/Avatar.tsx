import { EntityFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";
import MuiAvatar, { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import Blockies from "react-blockies";
import { getAvatarString } from "./getAvatarString";
import { stringToColor } from "./stringToColor";
import { SxProps } from "@mui/material";
import { AvatarProps } from "./type";


export const Avatar = ({ avatar, size, ...props }: AvatarProps) => {
  const { sx } = props ?? {};
  const defaultStyles: SxProps = {
    bgcolor: stringToColor(avatar.id),
    width: size ?? "24px",
    height: size ?? "24px",
  };
  return (
    <MuiAvatar
      src={avatar.icon ?? ""}
      children={
        avatar.__typename === "Identity" &&
        avatar.identityType.__typename === "IdentityBlockchain" ? (
          <Blockies seed={avatar.identityType.address} />
        ) : (
          getAvatarString(avatar.name.toUpperCase())
        )
      }
      alt={avatar.name}
      {...props}
      sx={{ ...defaultStyles, ...sx }}
    />
  );
};

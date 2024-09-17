import { SxProps } from "@mui/material";
import MuiAvatar, { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import Blockies from "react-blockies";

import discordLogoUrl from "@/assets/discord-logo-blue.svg";
import izeLogo from "@/assets/ize-logo-circle.svg";
import nftUrl from "@/assets/nft.svg";
import telegramLogoUrl from "@/assets/telegram-logo.svg";
import { EntityFragment, UserSummaryPartsFragment } from "@/graphql/generated/graphql";

import { getAvatarString } from "./getAvatarString";
import { stringToColor } from "./stringToColor";

export interface AvatarProps extends MuiAvatarProps {
  avatar: EntityFragment | UserSummaryPartsFragment;
  size?: string;
}

const defaultGroupAvatarUrl = (
  entity: EntityFragment | UserSummaryPartsFragment,
): string | undefined => {
  if (entity.__typename === "Group") {
    if (entity.organization?.icon) {
      return entity.organization.icon;
    }
    switch (entity.groupType.__typename) {
      case "GroupTelegramChat":
        return telegramLogoUrl;
      case "DiscordRoleGroup":
        return discordLogoUrl;
      case "GroupNft":
        return nftUrl;
      case "GroupCustom":
        return izeLogo;
      default:
        return undefined;
    }
  } else {
    return undefined;
  }
};

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
      src={avatar.icon ?? defaultGroupAvatarUrl(avatar)}
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

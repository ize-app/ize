import MuiAvatar from "@mui/material/Avatar";
import MuiAvatarGroup from "@mui/material/AvatarGroup";
import { colors } from "../../style/style";

export interface AvatarProps {
  url: string;
  name: string;
}

export interface AvatarsProps {
  avatars: AvatarProps[];
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${
      name.split(" ").length > 1 ? name.split(" ")[1][0] : ""
    }`,
  };
}

export const Avatar = ({ url, name }: AvatarProps): JSX.Element => {
  return <MuiAvatar src={url} {...stringAvatar(name.toUpperCase())} />;
};

export const AvatarGroup = ({ avatars }: AvatarsProps): JSX.Element => {
  if (avatars.length === 1)
    return <Avatar url={avatars[0].url} name={avatars[0].name} />;
  else if (avatars.length >= 1)
    return (
      <MuiAvatarGroup
        max={3}
        total={avatars.length}
        sx={{
          "& .MuiAvatarGroup-avatar": {
            backgroundColor: colors.primaryContainer,
            color: colors.onPrimaryContainer,
          },
        }}
      >
        {avatars.map((avatar) => (
          <Avatar key={avatar.name} url={avatar.url} name={avatar.name} />
        ))}
      </MuiAvatarGroup>
    );
  else return <></>;
};

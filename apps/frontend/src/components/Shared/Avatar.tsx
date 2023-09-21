import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import MuiAvatar, { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import MuiAvatarGroup from "@mui/material/AvatarGroup";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import { SxProps } from "@mui/material";

import { useState } from "react";

export interface UserDataProps {
  avatarUrl: string;
  name: string;
  parent?: UserDataProps;
}

export interface UsersDataProps {
  users: UserDataProps[];
}

export interface AvatarProps extends MuiAvatarProps {
  avatarUrl: string;
  name: string;
  parent?: UserDataProps;
}

export const stringToColor = (string: string) => {
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
};

export const avatarString = (name: string) =>
  `${name.split(" ")[0][0]}${
    name.split(" ").length > 1 ? name.split(" ")[1][0] : ""
  }`;

export const Avatar = ({
  avatarUrl,
  name,
  parent,
  ...props
}: AvatarProps): JSX.Element => {
  const { sx } = props;
  const defaultStyles: SxProps = { bgcolor: stringToColor(name) };
  const styles = { ...sx, ...defaultStyles } as SxProps;

  return parent ? (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent={
        <Avatar
          name={parent.name}
          avatarUrl={parent.avatarUrl}
          className={"avatarBadge"}
          sx={{
            width: "1rem",
            height: "1rem",
          }}
        />
      }
    >
      <MuiAvatar
        src={avatarUrl}
        children={avatarString(name.toUpperCase())}
        alt={name}
        {...props}
        sx={styles}
      />
    </Badge>
  ) : (
    <MuiAvatar
      src={avatarUrl}
      alt={name}
      children={avatarString(name.toUpperCase())}
      {...props}
      sx={styles}
    />
  );
};

export const AvatarWithName = ({
  name,
  avatarUrl: url,
  parent,
}: UserDataProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "left",
        alignItems: "center",
        gap: "16px",
        verticalAlign: "middle",
      }}
    >
      <Avatar
        avatarUrl={url}
        name={name}
        parent={
          parent
            ? { name: parent.name, avatarUrl: parent.avatarUrl }
            : undefined
        }
      />
      <Typography
        variant="body1"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

export const AvatarGroup = ({ users }: UsersDataProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handlePopperOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopperClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {users.length > 1 ? (
        <MuiAvatarGroup
          max={3}
          total={users.length}
          sx={{
            "& .MuiAvatarGroup-avatar": {},
          }}
          aria-haspopup="true"
          onMouseEnter={handlePopperOpen}
          onMouseLeave={handlePopperClose}
        >
          {users.map((user) => (
            <Avatar
              key={user.name}
              avatarUrl={user.avatarUrl}
              parent={user.parent}
              name={user.name}
            />
          ))}
        </MuiAvatarGroup>
      ) : (
        <Avatar
          avatarUrl={users[0].avatarUrl}
          name={users[0].name}
          parent={users[0].parent}
          aria-haspopup="true"
          onMouseEnter={handlePopperOpen}
          onMouseLeave={handlePopperClose}
        />
      )}
      <Popper
        id={"mouse-over-popove-userlist"}
        open={open}
        anchorEl={anchorEl}
        sx={{
          pointerEvents: "none",
        }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              sx={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                gap: "8px",
                maxWidth: "200px",
              }}
              elevation={4}
            >
              {users.map((user) => (
                <AvatarWithName
                  name={user.name}
                  avatarUrl={user.avatarUrl}
                  parent={user.parent}
                />
              ))}
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

import Box from "@mui/material/Box";
import MuiAvatar, { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import MuiAvatarGroup from "@mui/material/AvatarGroup";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export interface UserDataProps {
  url: string;
  name: string;
}

export interface UsersDataProps {
  users: UserDataProps[];
}

export interface AvatarProps extends MuiAvatarProps {
  url: string;
  name: string;
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

export const Avatar = ({ url, name, ...props }: AvatarProps): JSX.Element => {
  return (
    <MuiAvatar src={url} {...stringAvatar(name.toUpperCase())} {...props} />
  );
};

export const AvatarWithName = ({ name, url }: UserDataProps): JSX.Element => {
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
      <Avatar url={url} name={name} />
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
            <Avatar key={user.name} url={user.url} name={user.name} />
          ))}
        </MuiAvatarGroup>
      ) : (
        <Avatar
          url={users[0].url}
          name={users[0].name}
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
                <AvatarWithName name={user.name} url={user.url} />
              ))}
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

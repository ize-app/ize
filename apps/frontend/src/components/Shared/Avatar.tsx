import { SxProps } from "@mui/material";
import MuiAvatar, { AvatarProps as MuiAvatarProps } from "@mui/material/Avatar";
import MuiAvatarGroup from "@mui/material/AvatarGroup";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import {
  AgentSummaryPartsFragment,
  AgentType,
  UserSummaryPartsFragment,
} from "../../graphql/generated/graphql";
import { avatarString, stringToColor } from "../../utils/inputs";

export interface AvatarWithNameProps {
  id: string;
  avatarUrl: string | undefined | null;
  name: string;
  color?: string | null;
  parent?: ParentProps;
  type: AgentType;
}

export interface ParentProps {
  avatarUrl: string | undefined | null;
  name: string;
}

export interface AvatarProps extends MuiAvatarProps {
  id: string;
  type: AgentType;
  avatarUrl?: string | null | undefined;
  name: string;
  parent?: ParentProps;
  backgroundColor?: string | null | undefined;
}

export const reformatAgentForAvatar = (
  agent: AgentSummaryPartsFragment | UserSummaryPartsFragment,
): AvatarProps => {
  switch (agent.__typename) {
    case "Group":
      return {
        id: agent.id,
        name: agent.name,
        type: AgentType.Group,
        avatarUrl: agent.icon,
        backgroundColor: agent.color,
      };

    case "Identity":
      return {
        id: agent.id,
        name: agent.name,
        type: AgentType.Identity,
        avatarUrl: agent.icon,
        backgroundColor: null,
      };
    case "User":
      return {
        id: agent.id,
        name: agent.name,
        type: AgentType.Identity, // TODO: Make an "AvatarType" enum that includes "User"
        avatarUrl: agent.icon,
        backgroundColor: null,
      };
    default: {
      throw Error("ERROR: Unknown agent type for avatar (reformatAgentForAvatar)");
    }
  }
};

export const Avatar = ({
  id,
  avatarUrl,
  name,
  parent,
  backgroundColor,
  ...props
}: AvatarProps): JSX.Element => {
  const { sx } = props;
  const defaultStyles: SxProps = {
    bgcolor: backgroundColor ? backgroundColor : stringToColor(id ?? name),
  };
  const styles = { ...sx, ...defaultStyles } as SxProps;

  return parent ? (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent={
        // TODO: Going to rebuild this avatar component soon, so holding off on fixing this ts error
        //@ts-ignore
        <Avatar
          id={parent.name}
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
        src={avatarUrl ?? ""}
        children={avatarString(name.toUpperCase())}
        alt={name}
        {...props}
        sx={styles}
      />
    </Badge>
  ) : (
    <MuiAvatar
      src={avatarUrl ?? ""}
      alt={name}
      children={avatarString(name.toUpperCase())}
      {...props}
      sx={styles}
    />
  );
};

export const AvatarWithName = ({
  id,
  name,
  avatarUrl: url,
  type,
  parent,
  color,
}: AvatarWithNameProps): JSX.Element => {
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
      {
        <Avatar
          id={id}
          type={type}
          avatarUrl={url}
          name={name}
          variant="rounded"
          backgroundColor={color}
          parent={parent ? { name: parent.name, avatarUrl: parent.avatarUrl } : undefined}
        />
      }
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

const AvatarPopper = ({
  users,
  anchorEl,
  open,
}: {
  users: AvatarProps[];
  anchorEl: HTMLElement | null;
  open: boolean;
}) => (
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
          {users.map((user: AvatarProps) => (
            <AvatarWithName
              id={user.id}
              type={user.type}
              key={user.id}
              name={user.name}
              avatarUrl={user.avatarUrl}
              parent={user.parent}
              color={user.backgroundColor}
            />
          ))}
        </Paper>
      </Fade>
    )}
  </Popper>
);
export const AvatarGroup = ({
  agents,
}: {
  agents: (AgentSummaryPartsFragment | UserSummaryPartsFragment)[];
}): JSX.Element => {
  const avatars: AvatarProps[] = agents.map((agent) => reformatAgentForAvatar(agent));
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
      <MuiAvatarGroup
        max={3}
        total={agents.length}
        sx={{
          "& .MuiAvatarGroup-avatar": {},
        }}
        aria-haspopup="true"
        onMouseEnter={handlePopperOpen}
        onMouseLeave={handlePopperClose}
      >
        {avatars.map((a) => (
          <Avatar
            id={a.id}
            key={a.id}
            type={a.type}
            avatarUrl={a.avatarUrl}
            parent={a.parent}
            name={a.name}
            backgroundColor={a.backgroundColor}
          />
        ))}
      </MuiAvatarGroup>
      <AvatarPopper users={avatars} anchorEl={anchorEl} open={open} />
    </>
  );
};

export const NameWithPopper = ({
  name,
  agents,
}: {
  name: string;
  agents: (AgentSummaryPartsFragment | UserSummaryPartsFragment)[];
}) => {
  const agentsFormatted: AvatarProps[] = agents.map((agent) => reformatAgentForAvatar(agent));

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
      <Typography
        variant={"body1"}
        fontWeight={"600"}
        color={"primary"}
        onMouseEnter={handlePopperOpen}
        onMouseLeave={handlePopperClose}
      >
        {name}
      </Typography>
      <AvatarPopper users={agentsFormatted} anchorEl={anchorEl} open={open} />
    </>
  );
};

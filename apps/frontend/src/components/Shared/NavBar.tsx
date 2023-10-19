import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { ArrowDropDown, Logout, Home } from "@mui/icons-material";
import { ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Avatar } from "./Avatar";
import { CurrentUserContext } from "../../contexts/current_user_context";
import { ConnectToDiscord } from "./ConnectToDiscord";
import { LogOutDocument } from "../../graphql/generated/graphql";
import { Logo } from "./Logo";
import { Route } from "../../routers/routes";
import { colors } from "../../style/style";
import { createDiscordAvatarURL } from "../../utils/discord";

interface NavLinkProps {
  title: string;
  url: string;
}

const NavLink = ({ title, url }: NavLinkProps): JSX.Element => {
  const NavLinkContainer = styled.li`
    display: flex;
    width: 120px;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;

    a {
      color: ${colors.primary};
      text-align: center;
      font-size: 1rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-decoration: none;
      @media (max-width: 600px) {
        visibility: hidden;
      }
    }
  `;

  return (
    <NavLinkContainer>
      <Link to={url}>{title}</Link>
    </NavLinkContainer>
  );
};

interface UserDropDownProps {
  username: string;
  avatarURL: string;
}

const UserDropDownContainer = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const UserDropDown = ({
  username,
  avatarURL,
}: UserDropDownProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [logOut] = useMutation(LogOutDocument, {
    onCompleted: () => navigate(Route.Home),
    update: (cache) =>
      cache.evict({
        id: "ROOT_QUERY",
        fieldName: "me",
      }),
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logOut();
    handleClose();
  };

  return (
    <>
      <UserDropDownContainer onClick={handleClick}>
        <Avatar avatarUrl={avatarURL} name={username} />
        <Typography variant="body1">{username}</Typography>
        <ArrowDropDown />
      </UserDropDownContainer>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        autoFocus={false}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          <Link to={"/"}>Dashboard</Link>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

const NavContainer = styled.nav`
  display: flex;
  height: 60px;
  padding: 0px 8px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const NavControlContainer = styled.ol`
  display: flex;
  align-items: center;
  gap: 30px;
  align-self: stretch;
`;

export const NavBar: React.FC = () => {
  const { user } = useContext(CurrentUserContext);
  return (
    <NavContainer>
      {/* <Logo fontSize={"1.75rem"}>Cults </Logo> */}
      <div></div>
      <NavControlContainer>
        {user == null || user.discordData == null ? (
          <ConnectToDiscord />
        ) : (
          <>
            <NavLink title="Dashboard" url="/" />
            <UserDropDown
              username={user.discordData.username}
              avatarURL={createDiscordAvatarURL(
                user.discordData.discordId,
                user.discordData.avatar,
                128,
              )}
            />
          </>
        )}
      </NavControlContainer>
    </NavContainer>
  );
};

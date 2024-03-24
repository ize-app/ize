import styled from "@emotion/styled";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Home from "@mui/icons-material/Home";
import Logout from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import SettingsIcon from "@mui/icons-material/Settings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Avatar } from "./Avatar";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { colors } from "../style/style";
import Login from "./Auth/Login";
import { useStytch } from "@stytch/react";
import { Route } from "@/routers/routes";

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
  avatarURL: string | null;
}

const UserDropDownContainer = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const UserDropDown = ({ username, avatarURL }: UserDropDownProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const stytch = useStytch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    stytch.session.revoke();
    handleClose();
  };

  return (
    <>
      <UserDropDownContainer onClick={handleClick}>
        {
          // holding off on all avatar ts scripts until I rewrite that component
          //@ts-ignore
          <Avatar avatarUrl={avatarURL} name={username} />
        }
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
        <MenuItem>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <Link to={Route.UserSettings}>Settings</Link>
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
  const { me } = useContext(CurrentUserContext);
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const theme = useTheme();
  const isOverSmScreen = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <NavContainer>
      {isHomePage && me == null ? (
        <Box></Box>
      ) : (
        <img src="/logo-yellow.png" style={{ height: "24px", marginLeft: "12px" }} />
      )}

      <NavControlContainer>
        {me == null ? (
          <>
            <Login />
          </>
        ) : (
          <>
            {isOverSmScreen ? <NavLink title="Dashboard" url="/" /> : null}
            <UserDropDown username={me.user.name} avatarURL={me.user.icon ?? null} />
          </>
        )}
      </NavControlContainer>
    </NavContainer>
  );
};

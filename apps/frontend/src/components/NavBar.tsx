import { useMutation } from "@apollo/client";
import styled from '@emotion/styled';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CurrentUserContext } from "../contexts/current_user_context";
import { ConnectToDiscord } from "./ConnectToDiscord";
import { LogOutDocument } from "../graphql/generated/graphql";
import { Logo } from "./Logo";
import { Route } from "../routers/routes";

const NavContainer = styled.div`
  display: flex;
  height: 60px; 
  padding: 0px 8px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`

const NavControlContainer = styled.div `
  display: flex;
  align-items: center;
  gap: 30px;
  align-self: stretch;
`

interface NavLinkProps {
  title: string;
  url: string;
}

const NavLinkContainer = styled.div`
  display: flex;
  width: 137px;
  flex-direction: column;
  justify-content: center;
  align-self: stretch;
`

const NavLinkLink = styled.a`
  color: #6750A4;
  text-align: center;
  /* M3/label/medium */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 114.286% */
  letter-spacing: 0.5px;
  text-decoration: none;
  
`

const NavLink = ({title,url}:NavLinkProps):JSX.Element => {
  return <NavLinkContainer>
    <NavLinkLink href={url}>{title}</NavLinkLink>
    </NavLinkContainer>
}

const NavAvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`

const NavAvatar = styled.img`
    height: 30px; 
    width: auto;
    border-radius: 100px;
  `

const NavAvatarUsername = styled.p`
  color: #000;
  /* M3/minimal/small */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 100% */
  letter-spacing: 0.1px;
`

interface NavMenuProps {
  username: string;
  avatarURL: string;
}

const NavMenu = ({username, avatarURL}: NavMenuProps):JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [logOut] = useMutation(LogOutDocument, {
    onCompleted: () => navigate(Route.Home), update: (cache) => cache.evict({
      id: "ROOT_QUERY",
      fieldName: "me",
    })
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
  }

  return (
    <>
      <NavAvatarContainer onClick={handleClick}>
        <NavAvatar src={avatarURL}/>
          <NavAvatarUsername>{username}</NavAvatarUsername>
        <ArrowDropDown/>
      </NavAvatarContainer>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export const NavBar: React.FC = () => {
  const { user } = useContext(CurrentUserContext);
  
  return (
  <NavContainer>
    <Logo fontSize={28}>Cults </Logo>
    <NavControlContainer>
      {(user == null || user.discordData == null) ?
          <ConnectToDiscord /> :
      
      <>
      <NavLink title='Dashboard' url='/test'/>
      <NavMenu username={user.discordData.username} avatarURL="https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png" /> 
      </>}
    </NavControlContainer>
  </NavContainer>)

};
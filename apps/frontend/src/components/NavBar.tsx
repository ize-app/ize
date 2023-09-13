import { useContext } from "react";
import styled from '@emotion/styled';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';


import { CurrentUserContext } from "../contexts/current_user_context";
import { ConnectToDiscord } from "./ConnectToDiscord";
import { LogOut } from "./LogOut";


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

const Logo = styled.div`
  color: var(--m-3-sys-light-primary, #6750A4);
  font-family: Roboto;
  font-size: 28px;
  font-style: italic;
  font-weight: 700;
  line-height: 36px; /* 128.571% */
  width: 259px;
  height: 38px;
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

export const NavBar: React.FC = () => {
  const { user } = useContext(CurrentUserContext);
  console.log('user is',user)
  return (
  <NavContainer>
    <Logo>Cults </Logo>
    <NavControlContainer>
      {(user == null || user.discordData == null) ?
          <ConnectToDiscord /> :
      
      <>
      <NavLink title='Dashboard' url='/test'/>
      <NavAvatarContainer>
      <NavAvatar src="https://cdn.discordapp.com/avatars/698194276101914774/487b3c7e19c14f456d12d5aea5cf3c71.png"/>
      <NavAvatarUsername>{user.discordData.username}</NavAvatarUsername>
      <ArrowDropDown/>
      <LogOut />
      </NavAvatarContainer>
      </>}
    </NavControlContainer>
  </NavContainer>)

};
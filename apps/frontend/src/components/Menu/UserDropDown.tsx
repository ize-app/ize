import styled from "@emotion/styled";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Logout from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { Avatar } from "../Avatar";
import { useStytch } from "@stytch/react";

interface UserDropDownProps {
  username: string;
  avatarURL: string | null;
}

const UserDropDownContainer = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin: 8px 16px 8px;
`;

export const UserDropDown = ({ username, avatarURL }: UserDropDownProps): JSX.Element => {
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
          <Avatar avatarUrl={avatarURL} name={username} sx={{ height: "24px", width: "24px" }} />
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

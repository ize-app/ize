import Logout from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useStytch } from "@stytch/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apolloClient } from "@/graphql/apollo";
import { MePartsFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";

import { Avatar } from "../Avatar";

interface UserDropDownProps {
  me: MePartsFragment;
}

export const UserDropDown = ({ me }: UserDropDownProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const stytch = useStytch();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    await stytch.session.revoke();
    await apolloClient.clearStore();
    // await apolloClient.resetStore();
    handleClose();
    window.location.reload();
  };

  return (
    <>
      <Box onClick={handleClick}>
        <Avatar avatar={me.user} />
      </Box>
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
        <MenuItem
          onClick={() => {
            navigate(Route.Settings);
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
      </Menu>
    </>
  );
};

import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import { Box, Toolbar } from "@mui/material";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Route } from "@/routers/routes";

import { CreateListButton } from "./CreateButton";

interface MenuProps {
  open: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  drawerWidth: number;
}

export function Menu({ open, setMenuOpen, drawerWidth }: MenuProps) {
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(true);
  }, []);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        justifyContent: "space-between",
        alignItems: "space-between",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          justifyContent: "space-between",
          alignItems: "space-between",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box sx={{ overflow: "auto" }}>
        <Toolbar variant="dense" />
        <List>
          <ListItem disablePadding>
            <CreateListButton />
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(Route.Requests);
              }}
            >
              <ListItemIcon>
                <CheckCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary={"Requests"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(Route.Flows);
              }}
            >
              <ListItemIcon>
                <AccountTreeIcon />
              </ListItemIcon>
              <ListItemText primary={"Flows"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(Route.Groups);
              }}
            >
              <ListItemIcon>
                <Diversity2Icon />
              </ListItemIcon>
              <ListItemText primary={"Groups"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate(Route.Identities);
            }}
          >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Identities"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary={"Feedback"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

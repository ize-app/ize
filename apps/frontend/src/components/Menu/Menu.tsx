import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import GroupIcon from "@mui/icons-material/Group";
import EmailIcon from "@mui/icons-material/Email";
import { CreateListButton } from "./CreateButton";
import { Dispatch, SetStateAction } from "react";

import { Box } from "@mui/material";
import { UserDropDown } from "./UesrDropDown";
import { MePartsFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

interface MenuProps {
  open: boolean;
  handleDrawerClose: () => void;
  me: MePartsFragment;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export function Menu({ open, handleDrawerClose, me, setMenuOpen }: MenuProps) {
  const theme = useTheme();
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
      <Box>
        <DrawerHeader>
          <Box>
            <img src="/logo-yellow.png" style={{ height: "20px", marginLeft: "12px" }} />
          </Box>
          <IconButton onClick={handleDrawerClose} sx={{ padding: "0px" }}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>

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
                <AccountTreeIcon />
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
        </List>
      </Box>
      <Box>
        <List>
          <ListItem>
            <UserDropDown username={me.user.name} avatarURL={me.user.icon ?? null} />
          </ListItem>
          <Divider />
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
      </Box>
    </Drawer>
  );
}

import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import InboxIcon from "@mui/icons-material/Inbox";
import { Box, Button, Toolbar, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { generatePath, useNavigate } from "react-router-dom";

import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import {
  NewCustomGroupRoute,
  NewFlowRoute,
  Route,
  newCustomGroupRoute,
  newFlowRoute,
} from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

interface MenuProps {
  open: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  drawerWidth: number;
}

export function Menu({ open, setMenuOpen, drawerWidth }: MenuProps) {
  const navigate = useNavigate();
  const { me } = useContext(CurrentUserContext);

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
            <ListItemButton
              onClick={() => {
                navigate(Route.Requests);
              }}
            >
              <ListItemIcon sx={{ minWidth: "36px" }}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Inbox"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(Route.Flows);
              }}
            >
              <ListItemText
                primary={"Flows"}
                primaryTypographyProps={{ variant: "description", fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
          <List sx={{ padding: "0px 12px" }}>
            <ListItem disablePadding>
              <Button
                color="secondary"
                startIcon={<AddIcon fontSize="small" />}
                onClick={() => {
                  navigate(newFlowRoute(NewFlowRoute.InitialSetup));
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Typography variant="description" fontWeight={400}>
                    New flow
                  </Typography>
                </Box>
              </Button>
            </ListItem>
          </List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(Route.Groups);
              }}
            >
              <ListItemText
                primary={"Groups"}
                primaryTypographyProps={{ variant: "description", fontWeight: "600" }}
              />
            </ListItemButton>
          </ListItem>
          <List sx={{ padding: "0px 12px" }}>
            {me?.groups.map((group) => (
              <ListItem disablePadding key={group.entityId}>
                <ListItemButton
                  sx={{ padding: "0px 12px" }}
                  onClick={() => {
                    navigate(
                      generatePath(Route.Group, {
                        groupId: fullUUIDToShort(group.id),
                      }),
                    );
                  }}
                >
                  <ListItemText
                    primary={group.name}
                    primaryTypographyProps={{ variant: "description" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <Button
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => {
                  navigate(newCustomGroupRoute(NewCustomGroupRoute.Setup));
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Typography variant="description" fontWeight={400}>
                    New group
                  </Typography>
                </Box>
              </Button>
            </ListItem>
          </List>
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

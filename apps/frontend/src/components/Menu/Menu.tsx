import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import { Box, IconButton, Toolbar } from "@mui/material";
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
                navigate(Route.Home);
                setMenuOpen(false);
              }}
            >
              <ListItemIcon sx={{ minWidth: "36px" }}>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={"Home"}
                primaryTypographyProps={{ variant: "description", fontWeight: 600 }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(Route.Flows);
                setMenuOpen(false);
              }}
            >
              <ListItemText
                primary={"Flow templates"}
                primaryTypographyProps={{ variant: "description", fontWeight: 600 }}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(newFlowRoute(NewFlowRoute.InitialSetup));
                  setMenuOpen(false);
                }}
              >
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(Route.Groups);
                setMenuOpen(false);
              }}
            >
              <ListItemText
                primary={"Groups"}
                primaryTypographyProps={{ variant: "description", fontWeight: "600" }}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(newCustomGroupRoute(NewCustomGroupRoute.Setup));
                  setMenuOpen(false);
                }}
              >
                <AddCircleOutlineIcon fontSize="small" />
              </IconButton>
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
                    setMenuOpen(false);
                  }}
                >
                  <ListItemText
                    primary={group.name}
                    primaryTypographyProps={{ variant: "description" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </List>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate(Route.Identities);
              setMenuOpen(false);
            }}
          >
            <ListItemIcon>
              <GroupIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"Identities"}
              primaryTypographyProps={{ variant: "description", fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              window.location.href = "mailto:ize.inquiries@gmail.com";
            }}
          >
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={"Feedback"}
              primaryTypographyProps={{ variant: "description", fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>
        {/* <a href="/terms" target="_blank" rel="noopener">
          Terms of Service
        </a>{" "}
        <a href="/privacy" target="_blank" rel="noopener">
          Privacy Policy
        </a> */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              window.open("https://ize.space/terms", "_blank", "noopener,noreferrer");
            }}
            sx={{ height: "24px" }}
          >
            <ListItemText
              primary={"Terms"}
              primaryTypographyProps={{ variant: "description", fontWeight: 500, fontSize: "12px" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              window.open("https://ize.space/privacy", "_blank", "noopener,noreferrer");
            }}
            sx={{ height: "24px" }}
          >
            <ListItemText
              primary={"Privacy policy"}
              primaryTypographyProps={{ variant: "description", fontWeight: 500, fontSize: "12px" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

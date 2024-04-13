import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import { styled } from "@mui/material/styles";

import Head from "./Head";
import Snackbar from "../components/Snackbar";
import { Menu } from "@/components/Menu/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import { CssBaseline, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { useContext, useState } from "react";
import LoginModal from "@/components/Auth/LoginModal";

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export const DefaultLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { me } = useContext(CurrentUserContext);

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <Head title="Ize" description="Distributed sensemaking" />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <CssBaseline />
        {me && (
          <>
            <AppBar position="sticky" open={menuOpen} color="transparent" sx={{ border: "none" }}>
              <IconButton
                color="primary"
                aria-label="open drawer"
                onClick={handleMenuOpen}
                edge="start"
                sx={{ width: "60px", mr: 2, ...(menuOpen && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
            </AppBar>
            <Menu
              open={menuOpen}
              setMenuOpen={setMenuOpen}
              handleDrawerClose={handleMenuClose}
              me={me}
            />
          </>
        )}
        <Main open={menuOpen}>
          <Outlet />
        </Main>
        <Snackbar />
        <LoginModal />
      </Box>
    </>
  );
};

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `${drawerWidth}px`,
  }),
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  boxShadow: "none",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

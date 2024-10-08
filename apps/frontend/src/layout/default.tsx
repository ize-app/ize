import { CssBaseline } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";

import usePageTracking from "@/analytics/usePageTracking";
import IdentityModal from "@/components/Auth/IdentityModal";
import LoginModal from "@/components/Auth/LoginModal";
import { Menu } from "@/components/Menu/Menu";
import { NavBar } from "@/components/Menu/NavBar";
import { UserSetupModal } from "@/components/UserSetupModal";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";

import Head from "./Head";
import Snackbar from "../components/Snackbar";

const drawerWidth = 240;

export const DefaultLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { me } = useContext(CurrentUserContext);

  usePageTracking();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <Head title="Ize" description="Distributed sensemaking" />
      <CssBaseline />
      <NavBar handleMenuToggle={handleMenuToggle} me={me} />
      <UserSetupModal />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {me && menuOpen && (
          <Menu open={menuOpen} setMenuOpen={setMenuOpen} drawerWidth={drawerWidth} />
        )}
        <Main open={menuOpen}>
          <Toolbar variant="dense" />
          <Outlet />
        </Main>
        <Snackbar />
        <LoginModal />
        <IdentityModal />
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

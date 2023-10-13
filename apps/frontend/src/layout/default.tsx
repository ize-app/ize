import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/shared/NavBar";

import Snackbar from "../components/Shared/Snackbar";

export const DefaultLayout = () => {
  return (
    <Container sx={{ display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Outlet />
      <Snackbar />
    </Container>
  );
};

import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/shared/NavBar";

import Snackbar from "../components/Shared/Snackbar";

export const DefaultLayout = () => {
  return (
    <>
      <NavBar />
      <Container sx={{ display: "flex", flexDirection: "column" }}>
        <Outlet />
        <Snackbar />
      </Container>
    </>
  );
};

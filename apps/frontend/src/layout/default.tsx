import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar";

export const DefaultLayout = () => {
  return (
    <Container>
      <NavBar />
      <Outlet />
    </Container>
  );
};

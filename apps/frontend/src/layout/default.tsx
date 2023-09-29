import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components/shared/NavBar";

export const DefaultLayout = () => {
  return (
    <Container sx={{ display: "flex", flexDirection: "column" }}>
      <NavBar />
      <Outlet />
    </Container>
  );
};

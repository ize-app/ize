import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { LoggedInUser } from "../components/LoggedInUser";

export const DefaultLayout = () => {
  return (
    <Container>
      <LoggedInUser />
      <Outlet />
    </Container>
  );
};

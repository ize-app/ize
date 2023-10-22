import { HeadphonesBatteryOutlined } from "@mui/icons-material";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";

import Head from "./Head";
import { NavBar } from "../components/shared/NavBar";
import Snackbar from "../components/shared/Snackbar";

export const DefaultLayout = () => {
  return (
    <>
      <Head title="Cults" description="The decision-making engine" />
      <NavBar />
      <Container sx={{ display: "flex", flexDirection: "column" }}>
        <Outlet />
        <Snackbar />
      </Container>
    </>
  );
};

import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

import Head from "./Head";
import { NavBar } from "../components/shared/NavBar";
import Snackbar from "../components/shared/Snackbar";

export const DefaultLayout = () => {
  return (
    <>
      <Head title="Cults" description="The decision-making engine" />
      <NavBar />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Outlet />
        <Snackbar />
      </Box>
    </>
  );
};

import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export const DefaultLayout = () => {
  return <Container><Outlet /></Container >
}

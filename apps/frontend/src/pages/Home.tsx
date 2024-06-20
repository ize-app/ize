import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LoginButton } from "@/components/Auth/LoginButton";
import { IzeLogoBackground } from "@/layout/IzeLogoBackground";
import { Route } from "@/routers/routes";

import { CurrentUserContext } from "../contexts/current_user_context";

const UnauthenticatedHome = () => {
  return (
    <IzeLogoBackground>
      <Box
        sx={(theme) => ({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: "30px",
          gap: "20px",
          borderRadius: "10px",
          // border: "#6750A4 1px solid",
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
          },
        })}
      >
        <Button variant="contained" color="primary" href="/" sx={{ width: "160px" }}>
          Join Alpha Waitlist
        </Button>
        <LoginButton />
      </Box>
    </IzeLogoBackground>
  );
};

export const Home = () => {
  const { me } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (me?.user) {
      navigate(Route.Requests);
    }
  }, [me, navigate]);

  return <UnauthenticatedHome />;
};

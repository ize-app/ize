import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import { LoginButton } from "@/components/Auth/LoginButton";
import { Route } from "@/routers/routes";

import { CurrentUserContext } from "../contexts/current_user_context";

const UnauthenticatedHome = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="./logo-yellow@2x.png"
        style={{
          width: "90%",
          height: "auto",
          marginBottom: "50px",
        }}
      />
      <Box
        sx={(theme) => ({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
          },
        })}
      >
        <Button variant="contained" color="primary" href="/">
          Join Alpha Waitlist
        </Button>
        <LoginButton />
      </Box>
    </Box>
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

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import izeLogoUrl from "@/assets/ize-logo-circle.svg";
import { LoginButton } from "@/components/Auth/LoginButton";
import { IzeLogoBackground } from "@/layout/IzeLogoBackground";
import { Route } from "@/routers/routes";

import { CurrentUserContext } from "../hooks/contexts/current_user_context";

const UnauthenticatedHome = () => {
  const navigate = useNavigate();
  return (
    <IzeLogoBackground>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: "50px",
          gap: "20px",
          borderRadius: "10px",
          maxWidth: "400px",
          // border: "#6750A4 1px solid",
          [theme.breakpoints.down("sm")]: {
            width: "80%",
            padding: "20px",
          },
        })}
      >
        <img src={izeLogoUrl} style={{ width: "200px" }} />
        <Typography textAlign={"center"}>
          Evolutionary, cross-tool, <br /> collaborative workflows
          <br />
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/about");
          }}
          sx={{ width: "160px" }}
        >
          Learn more
        </Button>
        <LoginButton sx={{ width: "160px" }} />
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

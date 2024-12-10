import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import izeLogoUrl from "@/assets/ize-logo-circle.svg";
import { LoginButton } from "@/components/Auth/LoginButton";
import { IzeLogoBackground } from "@/layout/IzeLogoBackground";

import { Requests } from "./Requests/Requests";
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
          padding: "30px",
          gap: "20px",
          borderRadius: "10px",
          minWidth: "300px",
          maxWidth: "400px",
          // border: "#6750A4 1px solid",
          [theme.breakpoints.down("sm")]: {
            width: "80%",
            padding: "20px",
          },
        })}
      >
        <img src={izeLogoUrl} style={{ width: "260px" }} />
        <Box sx={{ width: "100%" }}>
          <Typography variant="h2" textAlign={"center"}>
            Mycelial Process Platform
          </Typography>
          <Typography textAlign={"center"}>
            How distributed teams share power and harness collective intelligence
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "12px" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              navigate("/about");
            }}
            size="small"
            sx={{ width: "120px" }}
          >
            Learn more
          </Button>
          <LoginButton sx={{ width: "120px" }}>Get started</LoginButton>
        </Box>
      </Box>
    </IzeLogoBackground>
  );
};

export const Home = () => {
  const { me } = useContext(CurrentUserContext);

  if (!me?.user) return <UnauthenticatedHome />;
  else {
    return <Requests />;
  }
};

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext } from "react";

import Dashboard from "./Dashboard/Dashboard";
import { ConnectToDiscord } from "./shared/ConnectToDiscord";
import { CurrentUserContext } from "../contexts/current_user_context";
import Login from "./shared/Login";

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
      {/* <PageContainer> */}
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
        <Button variant="contained" color="primary" href="/api/auth/discord/login">
          Join Alpha Waitlist
        </Button>
        <ConnectToDiscord />
        <Login />
      </Box>
    </Box>
  );
};

export const Home = () => {
  const { me } = useContext(CurrentUserContext);
  return me?.user == null ? <UnauthenticatedHome /> : <Dashboard />;
};

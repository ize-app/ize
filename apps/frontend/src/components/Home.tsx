import styled from "@emotion/styled";
import { Button, Typography } from "@mui/material";
import { useContext } from "react";

import Dashboard from "./Dashboard/Dashboard";
import { ConnectToDiscord } from "./shared/ConnectToDiscord";
import { Logo } from "./shared/Logo";
import { CurrentUserContext } from "../contexts/current_user_context";

const PageContainer = styled.div`
  display: flex;
  padding: 0px 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex: 1 0 0;
  align-self: stretch;
  height: 100%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const UnauthenticatedHome = () => (
  <PageContainer>
    <Logo fontSize={"8rem"}>Cults</Logo>
    <Typography variant="h1" align="center">
      Process is King
    </Typography>
    <ButtonsContainer>
      <Button
        variant="contained"
        color="primary"
        href="/api/auth/discord/login"
      >
        Join Alpha Waitlist
      </Button>
      <ConnectToDiscord />
    </ButtonsContainer>
  </PageContainer>
);

export const Home = () => {
  const { user } = useContext(CurrentUserContext);
  return user == null || user.discordData == null ? (
    <UnauthenticatedHome />
  ) : (
    <Dashboard />
  );
};

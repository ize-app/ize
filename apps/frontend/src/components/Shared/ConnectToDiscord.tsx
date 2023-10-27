import Button from "@mui/material/Button";
import { useContext } from "react";

import { CurrentUserContext } from "../../contexts/current_user_context";

export const ConnectToDiscord: React.FC = () => {
  const { user } = useContext(CurrentUserContext);
  if (user != null && user.discordData) return null;

  return (
    <Button variant="outlined" color="secondary" href="/api/auth/discord/login">
      Log in with Discord
    </Button>
  );
};

import Button from "@mui/material/Button";
import { useContext } from "react";

import { CurrentUserContext } from "../../contexts/current_user_context";

export const ConnectToDiscord: React.FC = () => {
  const { me } = useContext(CurrentUserContext);
  if (me?.user != null) return null;

  return (
    <Button variant="outlined" color="secondary" href="/api/auth/discord/login">
      Log in with Discord
    </Button>
  );
};

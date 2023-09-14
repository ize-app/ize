import { useContext } from "react";
import { CurrentUserContext } from "../contexts/current_user_context";
import Button from "@mui/material/Button";

export const ConnectToDiscord: React.FC = () => {
  const { user } = useContext(CurrentUserContext);
  if (user != null) return null;

  return (
    <Button variant="outlined" color="secondary" href="/api/auth/discord/login">
      Log in with Discord
    </Button>
  );
};

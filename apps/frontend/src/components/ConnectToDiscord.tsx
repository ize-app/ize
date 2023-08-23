import { useContext } from "react";
import { CurrentUserContext } from "../contexts/current_user_context";

export const ConnectToDiscord: React.FC = () => {
  const { user } = useContext(CurrentUserContext);
  if (user != null) return null;

  return (
    <div>
      <a href={"/api/auth/discord/login"}>Connect To Discord</a>
    </div>
  );
};

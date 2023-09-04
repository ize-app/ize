import { useContext } from "react";
import { CurrentUserContext } from "../contexts/current_user_context";
import "./LoggedInUser.css";
import { ConnectToDiscord } from "./ConnectToDiscord";
import { LogOut } from "./LogOut";

export const LoggedInUser: React.FC = () => {
  const { user } = useContext(CurrentUserContext);
  if (user == null)
    return (
      <div className="logged-in-as">
        <ConnectToDiscord />
      </div>
    );

  if (user.discordData == null)
    return (
      <div className="logged-in-as">
        <ConnectToDiscord />
      </div>
    );

  return (
    <div className="logged-in-as">
      <p>Logged in as: {user.discordData.username}</p>
      <LogOut />
    </div>
  );
};

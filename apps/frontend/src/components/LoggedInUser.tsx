import { useContext } from "react";
import { CurrentUserContext } from "../contexts/current_user_context";
import "./LoggedInUser.css"

export const LoggedInUser: React.FC = () => {
  const { user } = useContext(CurrentUserContext);
  if (user == null) return null;

  if (user.discordData == null) return null;

  return <div className="logged-in-as">Logged in as: {user.discordData.username}</div>;
};

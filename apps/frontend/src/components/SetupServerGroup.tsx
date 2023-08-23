import { CurrentUserProvider } from "../contexts/current_user_context";
import { DiscordUserServers } from "./DiscordUserServers";

export const SetupServerGroup = () => {
  return (
    <CurrentUserProvider>
      <div>Pick a server</div>
      <DiscordUserServers />
    </CurrentUserProvider>
  );
};

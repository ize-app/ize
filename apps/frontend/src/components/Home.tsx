import { CurrentUserProvider } from "../contexts/current_user_context";
import { ConnectToDiscord } from "./ConnectToDiscord";

export const Home = () => (
  <CurrentUserProvider>
    <h1>Cults</h1>
    <ConnectToDiscord />
  </CurrentUserProvider>
);

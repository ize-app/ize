import { AddToServer } from "./AddToServer";
import { ConnectToDiscord } from "./ConnectToDiscord";
import { LoggedInUser } from "./LoggedInUser";
import { Users } from "./Users";

export const Home = () => (
  <>
    <h1>Cults</h1>
    <Users />
    <ConnectToDiscord />
    <LoggedInUser />
    <AddToServer />
  </>
);

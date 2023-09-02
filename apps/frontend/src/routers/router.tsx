import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/Home";
import { SetupServerGroup } from "../components/SetupServerGroup";
import { DefaultLayout } from "../layout/default";
import { DiscordUserServers } from "../components/DiscordUserServers";
import { Route, SetupServerGroupRoute } from "./routes";

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: Route.Home,
        element: <Home />,
      },
      {
        path: Route.SetupServerGroup,
        element: <SetupServerGroup />,
        children: [
          { path: SetupServerGroupRoute.Intro, element: <h1>Intro</h1> },
          { path: SetupServerGroupRoute.SelectServer, element: <DiscordUserServers /> },
          { path: SetupServerGroupRoute.HowCultsWorks, element: <h1>How Cults Works</h1> },
          { path: SetupServerGroupRoute.DefineProcess, element: <h1>Define Process</h1> },
          { path: SetupServerGroupRoute.Finish, element: <h1>Finish</h1> },
        ]
      },
    ],
  },
]);

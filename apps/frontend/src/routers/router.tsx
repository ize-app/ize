import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/Home";
import { SetupServerGroup } from "../components/SetupServerGroup/SetupServerGroup";
import { DefaultLayout } from "../layout/default";
import { DiscordUserServers } from "../components/DiscordUserServers";
import { Route, SetupServerGroupRoute } from "./routes";
import { DefineServerGroupProcesses } from "../components/SetupServerGroup/DefineServerGroupProcesses";
import { HowCultsWorks } from "../components/SetupServerGroup/HowCultsWorks";
import { Intro } from "../components/SetupServerGroup/Intro";
import { Finish } from "../components/SetupServerGroup/Finish";

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
          { path: SetupServerGroupRoute.Intro, element: <Intro /> },
          { path: SetupServerGroupRoute.SelectServer, element: <DiscordUserServers /> },
          { path: SetupServerGroupRoute.HowCultsWorks, element: <HowCultsWorks /> },
          { path: SetupServerGroupRoute.DefineProcess, element: <DefineServerGroupProcesses /> },
          { path: SetupServerGroupRoute.Finish, element: <Finish /> },
        ]
      },
    ],
  },
]);

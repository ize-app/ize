import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/Home";
import { SetupServerGroup } from "../components/SetupServerGroup/SetupServerGroup";
import { DefaultLayout } from "../layout/default";
import { DiscordUserServers } from "../components/DiscordUserServers";
import { Route, SetupServerGroupRoute, setUpServerRoute } from "./routes";
import { DefineServerGroupProcesses } from "../components/SetupServerGroup/DefineServerGroupProcesses";
import { HowCultsWorks } from "../components/SetupServerGroup/HowCultsWorks";
import { Intro } from "../components/SetupServerGroup/Intro";
import { Finish } from "../components/SetupServerGroup/Finish";
import { Group } from "../components/Groups/Group";

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: Route.Home,
        element: <Home />,
      },
      {
        element: <SetupServerGroup />,
        path: Route.SetupServerGroup,
        children: [
          { element: <Intro />, index: true },
          {
            path: setUpServerRoute(SetupServerGroupRoute.SelectServer),
            element: <DiscordUserServers />,
          },
          {
            path: setUpServerRoute(SetupServerGroupRoute.HowCultsWorks),
            element: <HowCultsWorks />,
          },
          {
            path: setUpServerRoute(SetupServerGroupRoute.DefineProcess),
            element: <DefineServerGroupProcesses />,
          },
          {
            path: setUpServerRoute(SetupServerGroupRoute.Finish),
            element: <Finish />,
          },
        ],
      },
      {
        path: Route.Group,
        element: <Group />,
      },
    ],
  },
]);

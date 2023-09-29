import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/Home";
import { SetupServerGroup } from "../components/SetupServerGroup/SetupServerGroup";
import { DefaultLayout } from "../layout/default";
import { DiscordUserServers } from "../components/SetupServerGroup/DiscordUserServers";
import { Route, SetupServerGroupRoute, setUpServerRoute } from "./routes";
import { DefineServerGroupProcesses } from "../components/SetupServerGroup/DefineServerGroupProcesses";
import { HowCultsWorks } from "../components/SetupServerGroup/HowCultsWorks";
import { Finish } from "../components/SetupServerGroup/Finish";
import { Group } from "../components/Groups/Group";
import { Request } from "../components/Request/Request";

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
          {
            path: setUpServerRoute(SetupServerGroupRoute.SelectServer),
            element: <DiscordUserServers />,
            index: true,
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
      {
        path: Route.Request,
        element: <Request />,
      },
    ],
  },
]);

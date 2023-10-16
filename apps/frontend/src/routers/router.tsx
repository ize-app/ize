import { createBrowserRouter } from "react-router-dom";

import { AuthRoute } from "./AuthRoute";
import { Home } from "../components/Home";
import * as NewProcess from "../components/NewProcess";
import * as NewServerGroup from "../components/NewServerGroup";
import { DefaultLayout } from "../layout/default";
import {
  Route,
  NewRequestRoute,
  NewServerGroupRoute,
  NewProcessRoute,
  newServerRoute,
  newProcessRoute,
  newRequestRoute,
} from "./routes";
import { Group } from "../components/Groups/Group";
import { Request } from "../components/Request/Request";
import { Process } from "../components/Process/Process";
import * as NewRequest from "../components/NewRequest";

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,

    children: [
      {
        path: Route.Home,
        element: <Home />,
      },
      {
        element: (
          <AuthRoute>
            <NewServerGroup.default />
          </AuthRoute>
        ),
        path: Route.SetupServerGroup,
        children: [
          {
            path: newServerRoute(NewServerGroupRoute.SelectServer),
            element: <NewServerGroup.DiscordUserServers />,
            index: true,
          },
          {
            path: newServerRoute(NewServerGroupRoute.HowCultsWorks),
            element: <NewServerGroup.HowCultsWorks />,
          },
          {
            path: newServerRoute(NewServerGroupRoute.DefineProcess),
            element: <NewServerGroup.DefineServerGroupProcesses />,
          },
          {
            path: newServerRoute(NewServerGroupRoute.Finish),
            element: <NewServerGroup.Finish />,
          },
        ],
      },
      {
        element: (
          <AuthRoute>
            <NewProcess.default />
          </AuthRoute>
        ),
        path: Route.SetupProcessGroup,
        children: [
          {
            path: newProcessRoute(NewProcessRoute.Intro),
            element: <NewProcess.ProcessIntro />,
            index: true,
          },
          {
            path: newProcessRoute(NewProcessRoute.Inputs),
            element: <NewProcess.ProcessInputs />,
          },
          {
            path: newProcessRoute(NewProcessRoute.Decisions),
            element: <NewProcess.ProcessRights />,
          },
          {
            path: newProcessRoute(NewProcessRoute.Finish),
            element: <NewProcess.ProcessFinish />,
          },
        ],
      },
      {
        element: (
          <AuthRoute>
            <NewRequest.default />
          </AuthRoute>
        ),
        path: Route.NewRequest,
        children: [
          {
            path: newRequestRoute(NewRequestRoute.SelectProcess),
            element: <NewRequest.SelectProcess />,
            index: true,
          },
          {
            path: newRequestRoute(NewRequestRoute.CreateRequest),
            element: <NewRequest.CreateRequest />,
            index: true,
          },
          {
            path: newRequestRoute(NewRequestRoute.Confirm),
            element: <NewRequest.Confirm />,
            index: true,
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
      {
        path: Route.Process,
        element: <Process />,
      },
    ],
  },
]);

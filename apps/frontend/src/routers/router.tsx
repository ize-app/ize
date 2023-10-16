import { createBrowserRouter } from "react-router-dom";

import { AuthRoute } from "./AuthRoute";
import { Home } from "../components/Home";
import {
  ProcessIntro,
  ProcessInputs,
  ProcessRights,
  ProcessFinish,
  SetupProcess,
} from "../components/SetupProcess";
import {
  DefineServerGroupProcesses,
  DiscordUserServers,
  Finish,
  HowCultsWorks,
  SetupServerGroup,
} from "../components/SetupServerGroup";
import { DefaultLayout } from "../layout/default";
import {
  Route,
  NewRequestRoute,
  SetupServerGroupRoute,
  SetupProcessRoute,
  setUpServerRoute,
  setUpProcessRoute,
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
            <SetupServerGroup />
          </AuthRoute>
        ),
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
        element: (
          <AuthRoute>
            <SetupProcess />
          </AuthRoute>
        ),
        path: Route.SetupProcessGroup,
        children: [
          {
            path: setUpProcessRoute(SetupProcessRoute.Intro),
            element: <ProcessIntro />,
            index: true,
          },
          {
            path: setUpProcessRoute(SetupProcessRoute.Inputs),
            element: <ProcessInputs />,
          },
          {
            path: setUpProcessRoute(SetupProcessRoute.Decisions),
            element: <ProcessRights />,
          },
          {
            path: setUpProcessRoute(SetupProcessRoute.Finish),
            element: <ProcessFinish />,
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

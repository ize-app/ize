import { createBrowserRouter } from "react-router-dom";

import { _404 } from "../components/404";
import { AuthRoute } from "./AuthRoute";
import { Home } from "../components/Home";
import * as NewProcess from "../components/NewProcess";
import * as NewServerGroup from "../components/NewServerGroup";
import { DefaultLayout } from "../layout/default";
import * as Routes from "./routes";
import { Group } from "../components/Groups/Group";
import { Request } from "../components/Request/Request";
import { Process } from "../components/Process/Process";
import * as EditProcess from "../components/EditProcess";
import * as NewRequest from "../components/NewRequest";

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,

    children: [
      {
        path: Routes.Route.Home,
        element: <Home />,
      },
      {
        element: (
          <AuthRoute>
            <NewServerGroup.default />
          </AuthRoute>
        ),
        path: Routes.Route.SetupServerGroup,
        children: [
          {
            path: Routes.newServerRoute(
              Routes.NewServerGroupRoute.SelectServer,
            ),
            element: <NewServerGroup.DiscordUserServers />,
            index: true,
          },
          {
            path: Routes.newServerRoute(
              Routes.NewServerGroupRoute.HowCultsWorks,
            ),
            element: <NewServerGroup.HowCultsWorks />,
          },
          {
            path: Routes.newServerRoute(
              Routes.NewServerGroupRoute.DefineProcess,
            ),
            element: <NewServerGroup.DefineServerGroupProcesses />,
          },
          {
            path: Routes.newServerRoute(Routes.NewServerGroupRoute.Finish),
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
        path: Routes.Route.SetupProcessGroup,
        children: [
          {
            path: Routes.newProcessRoute(Routes.NewProcessRoute.Intro),
            element: <NewProcess.ProcessIntro />,
            index: true,
          },
          {
            path: Routes.newProcessRoute(Routes.NewProcessRoute.Inputs),
            element: <NewProcess.ProcessInputs />,
          },
          {
            path: Routes.newProcessRoute(Routes.NewProcessRoute.Decisions),
            element: <NewProcess.ProcessRights />,
          },
          {
            path: Routes.newProcessRoute(Routes.NewProcessRoute.Finish),
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
        path: Routes.Route.NewRequest,
        children: [
          {
            path: Routes.newRequestRoute(Routes.NewRequestRoute.SelectProcess),
            element: <NewRequest.SelectProcess />,
            index: true,
          },
          {
            path: Routes.newRequestRoute(Routes.NewRequestRoute.CreateRequest),
            element: <NewRequest.CreateRequest />,
          },
          {
            path: Routes.newRequestRoute(Routes.NewRequestRoute.Confirm),
            element: <NewRequest.Confirm />,
          },
        ],
      },
      {
        element: (
          <AuthRoute>
            <EditProcess.default />
          </AuthRoute>
        ),
        path: Routes.Route.EditProcess,
        children: [
          {
            path: Routes.editProcessRoute(Routes.EditProcessRoute.Intro),
            element: <EditProcess.Intro />,
          },
          {
            path: Routes.editProcessRoute(Routes.EditProcessRoute.BasicInfo),
            element: <NewProcess.ProcessIntro />,
          },
          {
            path: Routes.editProcessRoute(Routes.EditProcessRoute.Inputs),
            element: <NewProcess.ProcessInputs />,
          },
          {
            path: Routes.editProcessRoute(Routes.EditProcessRoute.Decisions),
            element: <NewProcess.ProcessRights />,
          },
          {
            path: Routes.editProcessRoute(Routes.EditProcessRoute.Confirm),
            element: <EditProcess.DiffConfirmation />,
          },
        ],
      },
      {
        path: Routes.Route.Group,
        element: <Group />,
      },
      {
        path: Routes.Route.Request,
        element: <Request />,
      },
      {
        path: Routes.Route.Process,
        element: <Process />,
      },
      {
        path: "*",
        element: <_404 />,
      },
    ],
  },
]);

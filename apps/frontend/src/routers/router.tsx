import { createBrowserRouter } from "react-router-dom";

import { AuthRoute } from "@/routers/AuthRoute";
import * as Routes from "@/routers/routes";
import { _404 } from "@/components/404";
import * as EditProcess from "@/components/EditProcess";
import { Group } from "@/components/Groups/Group";
import { Home } from "@/components/Home";
import NewProcess from "@/components/NewProcess/NewProcess";
import * as NewRequest from "@/components/NewRequest";
import * as NewServerGroup from "@/components/NewServerGroup";
import { Process } from "@/components/Process/Process";
import { Request } from "@/components/Request/Request";
import { DefaultLayout } from "@/layout/default";
import * as ProcessForm from "@/components/shared/Form/ProcessForm/wizardScreens";

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
        path: Routes.Route.NewServerGroup,
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
            <NewProcess />
          </AuthRoute>
        ),
        path: Routes.Route.NewProcess,
        children: [
          {
            path: Routes.newProcessRoute(Routes.NewProcessRoute.Intro),
            element: <ProcessForm.Template />,
            index: true,
          },
          {
            path: Routes.newProcessRoute(Routes.NewProcessRoute.Inputs),
            element: <ProcessForm.TemplateInputs />,
          },
          {
            path: Routes.newProcessRoute(Routes.NewProcessRoute.Decisions),
            element: <ProcessForm.Roles />,
          },
          {
            path: Routes.newProcessRoute(Routes.NewProcessRoute.Finish),
            element: <ProcessForm.ConfirmNewProcess />,
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
            index: true,
          },
          {
            path: Routes.editProcessRoute(Routes.EditProcessRoute.BasicInfo),
            element: <ProcessForm.Template />,
          },
          {
            path: Routes.editProcessRoute(Routes.EditProcessRoute.Inputs),
            element: <ProcessForm.TemplateInputs />,
          },
          {
            path: Routes.editProcessRoute(Routes.EditProcessRoute.Decisions),
            element: <ProcessForm.Roles />,
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

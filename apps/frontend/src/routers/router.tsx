import { createBrowserRouter } from "react-router-dom";

import { _404 } from "@/components/404";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import EditProcess from "@/components/EditProcess/EditProcess";
import { Group } from "@/components/Groups/Group";
import { Home } from "@/components/Home";
import NewProcess from "@/components/NewProcess/NewProcess";
import * as NewRequest from "@/components/NewRequest";
import * as NewServerGroup from "@/components/NewServerGroup";
import { Process } from "@/components/Process/Process";
import { Request } from "@/components/Request/Request";
import * as ProcessForm from "@/components/shared/Form/ProcessForm/wizardScreens";
import { DefaultLayout } from "@/layout/default";
import { AuthRoute } from "@/routers/AuthRoute";
import * as Routes from "@/routers/routes";
import { ResetPassword } from "@/components/shared/Auth/ResetPassword";

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: Routes.Route.Home,
        element: <Home />,
        errorElement: <ErrorBoundary />,
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
            path: Routes.newServerRoute(Routes.NewServerGroupRoute.SelectServer),
            element: <NewServerGroup.DiscordUserServers />,
            index: true,
          },
          {
            path: Routes.newServerRoute(Routes.NewServerGroupRoute.HowCultsWorks),
            element: <NewServerGroup.HowCultsWorks />,
          },
          {
            path: Routes.newServerRoute(Routes.NewServerGroupRoute.DefineProcess),
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
        errorElement: <ErrorBoundary />,
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
            path: Routes.newProcessRoute(Routes.NewProcessRoute.Evolve),
            element: <ProcessForm.Evolve />,
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
        errorElement: <ErrorBoundary />,
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
            <EditProcess />
          </AuthRoute>
        ),
        path: Routes.Route.EditProcess,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: Routes.editProcessRoute(Routes.EditProcessRoute.Intro),
            element: <ProcessForm.EditProcessIntro />,
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
            path: Routes.editProcessRoute(Routes.EditProcessRoute.Evolve),
            element: <ProcessForm.Evolve />,
          },
          {
            path: Routes.editProcessRoute(Routes.EditProcessRoute.Confirm),
            element: <ProcessForm.DiffConfirmation />,
          },
        ],
      },
      {
        path: Routes.Route.Group,
        errorElement: <ErrorBoundary />,
        element: <Group />,
      },
      {
        path: Routes.Route.Request,
        errorElement: <ErrorBoundary />,
        element: <Request />,
      },
      {
        path: Routes.Route.Process,
        errorElement: <ErrorBoundary />,
        element: <Process />,
      },
      {
        path: Routes.Route.ResetPassword,
        errorElement: <ErrorBoundary />,
        element: <ResetPassword />,
      },
      {
        path: "*",
        element: <_404 />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);

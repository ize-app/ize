import { createBrowserRouter } from "react-router-dom";

import { ResetPassword } from "@/components/Auth/ResetPassword";
import { FullConfigSetup } from "@/components/Form/FlowForm/wizardScreens/FullConfigSetup";
import { DefaultLayout } from "@/layout/default";
import { _404 } from "@/pages/404";
import { About } from "@/pages/About";
import { ErrorBoundary } from "@/pages/ErrorBoundary";
import * as EvolveFlow from "@/pages/EvolveFlow";
import { Flow } from "@/pages/Flow/Flow";
import { Flows } from "@/pages/Flows/Flows";
import { Group } from "@/pages/Group/Group";
import { Groups } from "@/pages/Groups/Groups";
import { Home } from "@/pages/Home";
import * as NewCustomGroup from "@/pages/NewCustomGroup";
import * as NewFlow from "@/pages/NewFlow";
import * as NewRequest from "@/pages/NewRequest";
import { Request } from "@/pages/Request/Request";
import { Requests } from "@/pages/Requests/Requests";
import { UserSettings } from "@/pages/Settings/UserSettings";
import { AuthRoute } from "@/routers/AuthRoute";
import * as Routes from "@/routers/routes";

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
        path: Routes.Route.About,
        element: <About />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: Routes.Route.Requests,
        element: (
          <AuthRoute>
            <Requests />
          </AuthRoute>
        ),
        errorElement: <ErrorBoundary />,
      },
      {
        path: Routes.Route.Flows,
        element: (
          <AuthRoute>
            <Flows />
          </AuthRoute>
        ),
        errorElement: <ErrorBoundary />,
      },
      {
        element: (
          <AuthRoute>
            <NewFlow.default />
          </AuthRoute>
        ),
        path: Routes.Route.NewFlow,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: Routes.newFlowRoute(Routes.NewFlowRoute.InitialSetup),
            element: <NewFlow.InitialConfigSetup />,
            index: true,
          },
          {
            path: Routes.newFlowRoute(Routes.NewFlowRoute.FullConfigSetup),
            element: <FullConfigSetup />,
          },
          {
            path: Routes.newFlowRoute(Routes.NewFlowRoute.Confirm),
            element: <NewFlow.Confirm />,
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
            path: Routes.newRequestRoute(Routes.NewRequestRoute.SelectFlow),
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
            <NewCustomGroup.default />
          </AuthRoute>
        ),
        path: Routes.Route.NewCustomGroup,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: Routes.newCustomGroupRoute(Routes.NewCustomGroupRoute.Setup),
            element: <NewCustomGroup.Setup />,
            index: true,
          },
          {
            path: Routes.newCustomGroupRoute(Routes.NewCustomGroupRoute.Policy),
            element: <NewCustomGroup.Policy />,
          },
          {
            path: Routes.newCustomGroupRoute(Routes.NewCustomGroupRoute.Confirm),
            element: <NewCustomGroup.Confirm />,
          },
        ],
      },
      {
        element: (
          <AuthRoute>
            <EvolveFlow.default />
          </AuthRoute>
        ),
        path: Routes.Route.EvolveFlow,
        errorElement: <ErrorBoundary />,
        children: [
          {
            path: Routes.evolveFlowRoute(Routes.EvolveFlowRoute.Setup),
            element: <FullConfigSetup />,
            index: true,
          },
          {
            path: Routes.evolveFlowRoute(Routes.EvolveFlowRoute.Context),
            element: <EvolveFlow.RequestContext />,
          },
          {
            path: Routes.evolveFlowRoute(Routes.EvolveFlowRoute.Confirm),
            element: <EvolveFlow.Confirm />,
          },
        ],
      },
      {
        path: Routes.Route.Group,
        errorElement: <ErrorBoundary />,
        element: <Group />,
      },
      {
        path: Routes.Route.Groups,
        errorElement: <ErrorBoundary />,
        element: <Groups />,
      },
      {
        path: Routes.Route.Request,
        errorElement: <ErrorBoundary />,
        element: <Request />,
      },
      {
        path: Routes.Route.Flow,
        errorElement: <ErrorBoundary />,
        element: <Flow />,
      },
      {
        path: Routes.Route.FlowVersion,
        errorElement: <ErrorBoundary />,
        element: <Flow />,
      },
      // TODO: remove Identities route
      {
        path: Routes.Route.Identities,
        errorElement: <ErrorBoundary />,
        element: (
          <AuthRoute>
            <UserSettings />
          </AuthRoute>
        ),
      },
      {
        path: Routes.Route.Settings,
        errorElement: <ErrorBoundary />,
        element: (
          <AuthRoute>
            <UserSettings />
          </AuthRoute>
        ),
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

import { createBrowserRouter } from "react-router-dom";

import { _404 } from "@/pages/404";
import { ErrorBoundary } from "@/pages/ErrorBoundary";
import { Group } from "@/pages/Groups/Group";
import { Home } from "@/pages/Home";
import * as NewFlow from "@/pages/NewFlow";
import { Setup as FlowSetup } from "@/components/Form/FlowForm/wizardScreens/Setup";
import * as NewRequest from "@/pages/NewRequest";
import { Flow } from "@/pages/Flow/Flow";
import { Request } from "@/pages/Request/Request";
import { DefaultLayout } from "@/layout/default";
import { AuthRoute } from "@/routers/AuthRoute";
import * as Routes from "@/routers/routes";
import { ResetPassword } from "@/components/Auth/ResetPassword";
import { UserSettings } from "@/pages/Settings/UserSettings";
import * as NewCustomGroup from "@/pages/NewCustomGroup";
import * as EvolveFlow from "@/pages/EvolveFlow";
import { Requests } from "@/pages/Requests/Requests";
import { Flows } from "@/pages/Flows/Flows";

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
            path: Routes.newFlowRoute(Routes.NewFlowRoute.Setup),
            element: <FlowSetup />,
            index: true,
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
            path: Routes.newCustomGroupRoute(Routes.NewCustomGroupRoute.Finish),
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
            element: <FlowSetup />,
            index: true,
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
        path: Routes.Route.Identities,
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

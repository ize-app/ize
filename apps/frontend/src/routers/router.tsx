import { createBrowserRouter } from "react-router-dom";

import { _404 } from "@/components/404";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Group } from "@/components/Groups/Group";
import { Home } from "@/components/Home";
import * as NewFlow from "@/components/NewFlow";
import { Setup as FlowSetup } from "@/components/shared/Form/FlowForm/wizardScreens/Setup";
import * as NewRequest from "@/components/NewRequest";
import { Flow } from "@/components/Flow/Flow";
import { Request } from "@/components/Request/Request";
import { DefaultLayout } from "@/layout/default";
import { AuthRoute } from "@/routers/AuthRoute";
import * as Routes from "@/routers/routes";
import { ResetPassword } from "@/components/shared/Auth/ResetPassword";
import { UserSettings } from "@/components/Settings/UserSettings";
import * as NewCustomGroup from "@/components/NewCustomGroup";
import * as EvolveFlow from "@/components/EvolveFlow";

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
        path: Routes.Route.UserSettings,
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

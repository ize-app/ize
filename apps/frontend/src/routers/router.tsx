import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/Home";
import { SetupServerGroup } from "../components/SetupServerGroup";

enum Route {
  Home = "/",
  SetupServerGroup = "/setup-server-group",
}

export const router = createBrowserRouter([{
  path: Route.Home,
  element: <Home />,
}, {
  path: Route.SetupServerGroup,
  element: <SetupServerGroup />,
}]);

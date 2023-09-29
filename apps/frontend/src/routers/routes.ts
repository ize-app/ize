export enum Route {
  Home = "/",
  SetupServerGroup = "/setup-server-group",
  Groups = "/groups",
  Group = "/groups/:groupId",
  Request = "/request/:requestId",
}

export enum SetupServerGroupRoute {
  SelectServer = "",
  HowCultsWorks = "/how-cults-works",
  DefineProcess = "/define-process",
  Finish = "/finish",
}

export const setUpServerRoute = (route: SetupServerGroupRoute) => {
  return `${Route.SetupServerGroup}${route}`;
};

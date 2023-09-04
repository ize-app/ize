export enum Route {
  Home = "/",
  SetupServerGroup = "/setup-server-group",
  Groups = "/groups",
  Group = "/groups/:groupId",
}

export enum SetupServerGroupRoute {
  Intro = "",
  SelectServer = "/servers",
  HowCultsWorks = "/how-cults-works",
  DefineProcess = "/define-process",
  Finish = "/finish",
}

export const setUpServerRoute = (route: SetupServerGroupRoute) => {
  return `${Route.SetupServerGroup}${route}`;
};

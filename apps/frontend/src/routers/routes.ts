export enum Route {
  Home = "/",
  SetupProcessGroup = "/setup/process",
  SetupServerGroup = "/setup/group",
  Groups = "/groups",
  Group = "/groups/:groupId",
  Request = "/request/:requestId",
}

export enum SetupProcessRoute {
  Intro = "",
  Inputs = "/inputs",
  Rights = "/rights",
  Finish = "/finish",
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

export const setUpProcessRoute = (route: SetupProcessRoute) => {
  return `${Route.SetupProcessGroup}${route}`;
};

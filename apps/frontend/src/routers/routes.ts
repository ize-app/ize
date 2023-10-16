export enum Route {
  Home = "/",
  SetupProcessGroup = "/setup/process",
  SetupServerGroup = "/setup/group",
  NewRequest = "/request/new",
  Groups = "/groups",
  Group = "/groups/:groupId",
  Request = "/request/:requestId",
  Process = "process/:processId",
}

export enum SetupProcessRoute {
  Intro = "",
  Inputs = "/inputs",
  Decisions = "/decisions",
  Finish = "/finish",
}

export enum SetupServerGroupRoute {
  SelectServer = "",
  HowCultsWorks = "/how-cults-works",
  DefineProcess = "/define-process",
  Finish = "/finish",
}

export enum NewRequestRoute {
  SelectProcess = "",
  CreateRequest = "/create/:processId",
  Confirm = "/confirm",
}

export const setUpServerRoute = (route: SetupServerGroupRoute) => {
  return `${Route.SetupServerGroup}${route}`;
};

export const setUpProcessRoute = (route: SetupProcessRoute) => {
  return `${Route.SetupProcessGroup}${route}`;
};

export const newRequestRoute = (route: NewRequestRoute) => {
  return `${Route.NewRequest}${route}`;
};

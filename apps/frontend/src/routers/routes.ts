export enum Route {
  Home = "/",
  SetupProcessGroup = "/setup/process",
  SetupServerGroup = "/setup/group",
  NewRequest = "/request/new",
  Groups = "/groups",
  Group = "/groups/:groupId",
  Request = "/request/:requestId",
  Process = "/process/:processId",
  EditProcess = "/edit/:processId",
}

export enum NewProcessRoute {
  Intro = "",
  Inputs = "/inputs",
  Decisions = "/decisions",
  Finish = "/finish",
}

export enum NewServerGroupRoute {
  SelectServer = "",
  HowCultsWorks = "/how-cults-works",
  DefineProcess = "/define-process",
  Finish = "/finish",
}

export enum NewRequestRoute {
  SelectProcess = "",
  CreateRequest = "/:processId",
  Confirm = "/:processId/confirm",
}

export enum EditProcessRoute {
  Intro = "",
  BasicInfo = "/info",
  Inputs = "/inputs",
  Decisions = "/decisions",
  Confirm = "/confirm",
}

export const newServerRoute = (route: NewServerGroupRoute) => {
  return `${Route.SetupServerGroup}${route}`;
};

export const newProcessRoute = (route: NewProcessRoute) => {
  return `${Route.SetupProcessGroup}${route}`;
};

export const newRequestRoute = (route: NewRequestRoute) => {
  return `${Route.NewRequest}${route}`;
};

export const editProcessRoute = (route: EditProcessRoute) => {
  return `${Route.EditProcess}${route}`;
};

export enum Route {
  Home = "/",
  UserSettings = "/settings",
  ResetPassword = "/resetpassword",
  NewProcess = "/create/process",
  NewFlow = "/create/flow",
  NewRequest = "/create/request",
  NewCustomGroup = "/create/group",
  Groups = "/groups",
  Group = "/groups/:groupId",
  Request = "/requests/:requestId",
  Process = "/processes/:processId",
  Flow = "/flow/:flowId",
  EditProcess = "/edit/:flowId",
  EvolveFlow = "/evolve/:flowId",
}

export enum NewProcessRoute {
  Setup = "",
  Intro = "/old-intro",
  Inputs = "/inputs",
  Decisions = "/decisions",
  Evolve = "/evolve",
  Finish = "/finish",
}

export enum NewRequestRoute {
  SelectFlow = "",
  CreateRequest = "/:flowId",
  Confirm = "/:flowId/confirm",
}

export enum NewFlowRoute {
  Setup = "",
  Confirm = "/confirm",
}

export enum NewCustomGroupRoute {
  Setup = "",
  Finish = "/finish",
}

export enum EditProcessRoute {
  Intro = "",
  BasicInfo = "/info",
  Inputs = "/inputs",
  Decisions = "/decisions",
  Evolve = "/evolve",
  Confirm = "/confirm",
}

export enum EvolveFlowRoute {
  Setup = "",
  Confirm = "/confirm",
}

export const newProcessRoute = (route: NewProcessRoute) => {
  return `${Route.NewProcess}${route}`;
};

export const newFlowRoute = (route: NewFlowRoute) => {
  return `${Route.NewFlow}${route}`;
};

export const evolveFlowRoute = (route: EvolveFlowRoute) => {
  return `${Route.EvolveFlow}${route}`;
};
export const newRequestRoute = (route: NewRequestRoute) => {
  return `${Route.NewRequest}${route}`;
};

export const editProcessRoute = (route: EditProcessRoute) => {
  return `${Route.EditProcess}${route}`;
};

export const newCustomGroupRoute = (route: NewCustomGroupRoute) => {
  return `${Route.NewCustomGroup}${route}`;
};

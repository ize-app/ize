export enum Route {
  Home = "/",
  Requests = "/requests",
  Flows = "/flows",
  Identities = "/identities",
  ResetPassword = "/resetpassword",
  NewFlow = "/create/flow",
  NewRequest = "/create/request",
  NewCustomGroup = "/create/group",
  Groups = "/groups",
  Group = "/groups/:groupId",
  Request = "/requests/:requestId",
  Flow = "/flow/:flowId/:flowVersionId?",
  EvolveFlow = "/evolve/:flowId",
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

export enum EvolveFlowRoute {
  Setup = "",
  Confirm = "/confirm",
}

export const newFlowRoute = (route: NewFlowRoute) => {
  return `${Route.NewFlow}${route}`;
};

export const evolveFlowRoute = (route: EvolveFlowRoute) => {
  return `${Route.EvolveFlow}${route}`;
};
export const newRequestRoute = (route: NewRequestRoute) => {
  return `${Route.NewRequest}${route}`;
};

export const newCustomGroupRoute = (route: NewCustomGroupRoute) => {
  return `${Route.NewCustomGroup}${route}`;
};

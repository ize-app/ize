export enum Route {
  Home = "/",
  About = "/about",
  Flows = "/flows",
  // settings and identities routes are used in Stytch redirects
  // take caution with modifying these routes
  Settings = "/settings",
  Identities = "/identities",
  ResetPassword = "/resetpassword",
  NewUser = "/newuser",
  NewFlow = "/create/flow",
  NewRequest = "/create/trigger",
  NewCustomGroup = "/create/group",
  Groups = "/groups",
  Group = "/groups/:groupId",
  Request = "/triggers/:requestId",
  Flow = "/flow/:flowId/:flowVersionId?",
  FlowVersion = "/flowVersion/:flowVersionId",
  EvolveFlow = "/evolve/:flowId",
}

export enum NewUserRoute {
  Welcome = "",
  Setup = "/setup",
}

export enum NewRequestRoute {
  SelectFlow = "",
  CreateRequest = "/:flowId",
  Confirm = "/:flowId/confirm",
}

export enum NewFlowRoute {
  InitialSetup = "",
  FullConfigSetup = "/full-setup",
  Confirm = "/confirm",
}

export enum NewCustomGroupRoute {
  Setup = "",
  Policy = "/policy",
  Confirm = "/confirm",
}

export enum EvolveFlowRoute {
  Setup = "",
  Context = "/context",
  Confirm = "/confirm",
}

export const newUserRoute = (route: NewUserRoute) => {
  return `${Route.NewUser}${route}`;
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

export const newCustomGroupRoute = (route: NewCustomGroupRoute) => {
  return `${Route.NewCustomGroup}${route}`;
};

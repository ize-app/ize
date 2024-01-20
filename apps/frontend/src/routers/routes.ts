export enum Route {
  Home = "/",
  UserSettings = "/settings",
  ResetPassword = "/resetpassword",
  NewProcess = "/create/process",
  NewRequest = "/create/request",
  Groups = "/groups",
  Group = "/groups/:groupId",
  Request = "/requests/:requestId",
  Process = "/processes/:processId",
  EditProcess = "/edit/:processId",
}

export enum NewProcessRoute {
  Intro = "",
  Inputs = "/inputs",
  Decisions = "/decisions",
  Evolve = "/evolve",
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
  Evolve = "/evolve",
  Confirm = "/confirm",
}

export const newProcessRoute = (route: NewProcessRoute) => {
  return `${Route.NewProcess}${route}`;
};

export const newRequestRoute = (route: NewRequestRoute) => {
  return `${Route.NewRequest}${route}`;
};

export const editProcessRoute = (route: EditProcessRoute) => {
  return `${Route.EditProcess}${route}`;
};

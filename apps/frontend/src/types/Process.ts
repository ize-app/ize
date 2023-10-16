import { UserDataProps } from "./User";

export interface Roles {
  request: UserDataProps[];
  respond: UserDataProps[];
  edit: UserDataProps;
}
interface UserRole {
  request: boolean;
  respond: boolean;
  edit: boolean;
}

export enum ThresholdTypes {
  Absolute = "Absolute",
  Percentage = "Percentage",
}

interface ProcessInput {
  name: string;
  description: string;
  required: boolean;
  type: ProcessInputType;
}

export enum ProcessInputType {
  Text = "Text",
  Number = "Number",
}

interface Quorum {
  threshold: number;
  thresholdType: ThresholdTypes;
}

export interface Decision {
  threshold: number;
  thresholdType: ThresholdTypes;
  requestExpirationSeconds: number;
  quorum: Quorum;
}

export default interface Process {
  processId: string;
  name: string;
  description: string;
  inputs: ProcessInput[];
  options: string[];
  webhookUri: string;
  roles: Roles;
  userRoles: UserRole;
  decision: Decision;
}

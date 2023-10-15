import { UserDataProps } from "./User";

interface Role {
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

interface ProcessQuorum {
  threshold: ThresholdTypes;
  thresholdType: number;
}

interface Decision {
  threshold: number;
  thresholdType: ThresholdTypes;
  requestExpirationSeconds: number;
  quorum: ProcessQuorum | null;
}

export default interface Process {
  processId: string;
  name: string;
  description: string;
  inputs: ProcessInput[];
  options: string[];
  webhookUri: string;
  roles: Role;
  userRoles: UserRole;
  decision: Decision;
}

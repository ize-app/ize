import { SetupProcessRoute, setUpProcessRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";
import { UserDataProps } from "../shared/Avatar";

export interface SetupProcessState {
  processName?: string;
  description?: string;
  customIntegration?: string;
  webhookUri?: string;
  options?: string;
  customOptions?: string[];
  inputs?: ProcessInput[];
  rights?: ProcessRights;
  decision?: ProcessDecision;
}

export interface ProcessDecision {
  decisionThresholdType?: ThresholdTypes;
  requestExpirationSeconds?: number;
  decisionThreshold?: number;
  quorum?: ProcessQuorum;
}

export interface ProcessQuorum {
  quorumType?: ThresholdTypes;
  quorumThreshold?: number;
}

export enum ThresholdTypes {
  Absolute = "Absolute",
  Percentage = "Percentage",
}

export interface ProcessInput {
  fieldName: string;
  description: string;
  required: boolean;
  type: ProcessInputType;
}

export interface ProcessRights {
  request: UserDataProps[];
  response: UserDataProps[];
  edit: UserDataProps;
}

export enum ProcessInputType {
  Text = "Text",
  Number = "Number",
}

export function useSetupProcessWizardState() {
  return useWizardFormState<SetupProcessState>();
}

export const SETUP_PROCESS_PROGRESS_BAR_STEPS = [
  "Process type",
  "Input fields",
  "Rights",
  "Finish",
];

export const SETUP_PROCESS_WIZARD_STEPS: WizardSteps<SetupProcessState> = [
  {
    path: setUpProcessRoute(SetupProcessRoute.Intro),
    title: "Create a New Process",
    progressBarStep: 0,
    canNext: () => true,
  },
  {
    path: setUpProcessRoute(SetupProcessRoute.Inputs),
    title: "Inputs fields on each request",
    progressBarStep: 1,
    canNext: () => true,
  },
  {
    path: setUpProcessRoute(SetupProcessRoute.Rights),
    title: "Who can use this process?",
    progressBarStep: 2,
    canNext: () => true,
  },
  {
    path: setUpProcessRoute(SetupProcessRoute.Finish),
    title: "Finish",
    progressBarStep: 3,
    canNext: () => true,
  },
];

import { InputTemplateArgs } from "../../graphql/generated/graphql";
import { NewProcessRoute, newProcessRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";
import { UserDataProps } from "../shared/Avatar";

export interface NewProcessState {
  name?: string;
  description?: string;
  customIntegration?: string;
  webhookUri?: string;
  options?: string;
  customOptions?: string[];
  inputs?: InputTemplateArgs[];
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
  name: string;
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

export function useNewProcessWizardState() {
  return useWizardFormState<NewProcessState>();
}

export const NEW_PROCESS_PROGRESS_BAR_STEPS = [
  "Purpose",
  "Inputs",
  "Decisions",
  "Finish",
];

export const NEW_PROCESS_WIZARD_STEPS: WizardSteps<NewProcessState> = [
  {
    path: newProcessRoute(NewProcessRoute.Intro),
    title: "Purpose of this process",
    progressBarStep: 0,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: newProcessRoute(NewProcessRoute.Inputs),
    title: "Inputs fields on each request",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: (formState: NewProcessState) => !!formState.name,
  },
  {
    path: newProcessRoute(NewProcessRoute.Decisions),
    title: "How decisions are made",
    progressBarStep: 2,
    canNext: () => true,
    validWizardState: (formState: NewProcessState) => !!formState.inputs,
  },
  {
    path: newProcessRoute(NewProcessRoute.Finish),
    title: "Finish",
    progressBarStep: 3,
    canNext: () => true,
    validWizardState: (formState: NewProcessState) =>
      !!formState.decision && !!formState.rights,
  },
];

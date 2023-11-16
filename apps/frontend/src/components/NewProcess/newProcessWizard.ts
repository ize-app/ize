import {
  AbsoluteDecisionArgs,
  InputTemplateArgs,
  OptionType,
  PercentageDecisionArgs,
  WebhookActionArgs,
} from "../../graphql/generated/graphql";
import { NewProcessRoute, newProcessRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";
import { AvatarProps } from "../shared/Avatar";

export enum HasCustomIntegration {
  "Yes" = "yes",
  "No" = "no",
}

export const defaultWebhookTriggerOption = {
  name: "All options trigger webhook",
  value: "allOptionsTriggerWebhook",
};

export interface NewProcessState {
  name?: string;
  description?: string;
  requestExpirationSeconds?: number;
  options?: string;
  customOptions?: string[];
  inputs?: InputTemplateArgs[];
  rights?: ProcessRights;
  decision?: ProcessDecision;
  action?: ActionForm;
}

export interface ProcessDecision {
  type: DecisionType;
  absoluteDecision: AbsoluteDecisionArgs;
  percentageDecision: PercentageDecisionArgs;
}

export enum FormOptionChoice {
  Custom = "Custom",
  Emoji = "Emoji",
  Checkmark = "Checkmark",
}

export const DefaultOptionSets = new Map([
  [
    FormOptionChoice.Checkmark,
    {
      display: "✅ ❌",
      data: [
        { value: "✅", type: OptionType.Text },
        { value: "❌", type: OptionType.Text },
      ],
    },
  ],
  [
    FormOptionChoice.Emoji,
    {
      display: "😃 😐 😭",
      data: [
        { value: "😃", type: OptionType.Text },
        { value: "😐", type: OptionType.Text },
        { value: "😐", type: OptionType.Text },
      ],
    },
  ],
  [FormOptionChoice.Custom, { display: "Custom", data: [] }],
]);

export interface ProcessQuorum {
  quorumType?: DecisionType;
  quorumThreshold?: number;
}

export enum DecisionType {
  Absolute = "Absolute",
  Percentage = "Percentage",
}

export interface ProcessRights {
  request: AvatarProps[];
  response: AvatarProps[];
}

export interface ActionForm {
  webhook: WebhookActionForm;
  optionTrigger?: string;
}

export interface WebhookActionForm {
  uri?: string;
  hasWebhook?: string;
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

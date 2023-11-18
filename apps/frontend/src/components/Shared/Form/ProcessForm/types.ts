import {
  AbsoluteDecisionArgs,
  OptionType,
  PercentageDecisionArgs,
} from "@/graphql/generated/graphql";
import { AvatarProps } from "@/components/shared/Avatar";

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

export interface ProcessDecision {
  requestExpirationSeconds?: number;
  type: DecisionType;
  absoluteDecision?: AbsoluteDecisionArgs;
  percentageDecision?: PercentageDecisionArgs;
}

export interface EvolveProcessForm {
  evolveDefaults: DefaultEvolveProcessOptions;
  rights: ProcessRights;
  decision: ProcessDecision;
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

export enum HasCustomIntegration {
  "Yes" = "yes",
  "No" = "no",
}

export const defaultWebhookTriggerOption = {
  name: "All options trigger webhook",
  value: "allOptionsTriggerWebhook",
};

export enum DefaultEvolveProcessOptions {
  ParticipantsRequestButCreatorApproves = "ParticipantsRequestButCreatorApproves",
  Custom = "Custom",
}

import { formatOptions } from "./formatOptions";
import { formatRoles } from "./formatRoles";
import {
  InputTemplateArgs,
  NewProcessArgs,
} from "../../../graphql/generated/graphql";
import {
  FormOptionChoice,
  NewProcessState,
  ProcessRights,
} from "../newProcessWizard";

export const formatFormStateForProcessMutation = (
  formState: NewProcessState,
): NewProcessArgs => {
  const inputs: NewProcessArgs = {
    name: formState.name as string,
    description: formState.description,
    expirationSeconds: formState.requestExpirationSeconds as number,
    inputs: formState.inputs as InputTemplateArgs[],
    roles: formatRoles(formState.rights as ProcessRights),
    action: formState.action?.webhook.uri
      ? {
          optionTrigger: formState.action.optionTrigger as string,
          webhook: {
            uri: formState.action.webhook.uri,
          },
        }
      : undefined,
    editProcessId: formState.rights?.edit.id as string,
    options: formatOptions(
      formState.options as FormOptionChoice,
      formState.customOptions as string[],
    ),
  };

  if (formState.decision?.decisionThresholdType === "Absolute") {
    inputs["absoluteDecision"] = {
      threshold: formState.decision.decisionThreshold as number,
    };
  } else if (formState.decision?.decisionThresholdType === "Percentage") {
    inputs["percentageDecision"] = {
      quorum: formState.decision.quorum as number,
      percentage: formState.decision.decisionThreshold as number,
    };
  }

  return inputs;
};

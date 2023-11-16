import createActionInputs from "./createActionInputs";
import { formatOptions } from "./formatOptions";
import { formatRoles } from "./formatRoles";
import {
  AbsoluteDecisionArgs,
  InputTemplateArgs,
  NewProcessArgs,
  PercentageDecisionArgs,
} from "../../../graphql/generated/graphql";
import {
  DecisionType,
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
    action: createActionInputs(formState.action),
    options: formatOptions(
      formState.options as FormOptionChoice,
      formState.customOptions as string[],
    ),
  };

  if (formState.decision?.type === DecisionType.Absolute) {
    inputs["absoluteDecision"] = {
      ...(formState.decision.absoluteDecision as AbsoluteDecisionArgs),
    };
  } else if (formState.decision?.type === DecisionType.Percentage) {
    inputs["percentageDecision"] = {
      ...(formState.decision.percentageDecision as PercentageDecisionArgs),
    };
  }

  return inputs;
};

import {
  FormOptionChoice,
  NewProcessState,
  ProcessRights,
} from "../../../../NewProcess/newProcessWizard";
import {
  InputTemplateArgs,
  NewProcessArgs,
} from "../../../../../graphql/generated/graphql";

import {
  createActionInputs,
  createDecisionInputs,
  createOptionInputs,
  createRoleInputs,
} from "./index";

const createNewProcessMutation = (
  formState: NewProcessState,
): NewProcessArgs => {
  const inputs: NewProcessArgs = {
    name: formState.name as string,
    description: formState.description,
    expirationSeconds: formState.requestExpirationSeconds as number,
    inputs: formState.inputs as InputTemplateArgs[],
    roles: createRoleInputs(formState.rights as ProcessRights),
    action: createActionInputs(formState.action),
    options: createOptionInputs(
      formState.options as FormOptionChoice,
      formState.customOptions as string[],
    ),
    decision: createDecisionInputs(formState.decision),
  };

  return inputs;
};

export default createNewProcessMutation;

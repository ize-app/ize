import { ProcessForm } from "@/components/shared/Form/ProcessForm/types";
import {
  FormOptionChoice,
  ProcessRights,
} from "@/components/shared/Form/ProcessForm/types";
import { InputTemplateArgs, NewProcessArgs } from "@/graphql/generated/graphql";

import {
  createActionInputs,
  createDecisionInputs,
  createOptionInputs,
  createRoleInputs,
} from "./index";

const createProcessMutation = (formState: ProcessForm): NewProcessArgs => {
  const inputs: NewProcessArgs = {
    name: formState.name as string,
    description: formState.description,
    inputs: formState.inputs as InputTemplateArgs[],
    roles: createRoleInputs(formState.rights as ProcessRights),
    action: createActionInputs(formState.action),
    options: createOptionInputs(
      formState.options as FormOptionChoice,
      formState.customOptions as string[],
    ),
    decision: createDecisionInputs(formState.decision),
    evolve: {
      decision: createDecisionInputs(formState.evolve?.decision),
      roles: createRoleInputs(formState.evolve?.rights as ProcessRights),
    },
  };

  return inputs;
};

export default createProcessMutation;

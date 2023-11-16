import { diff } from "deep-object-diff";

import { NewEditProcessRequestArgs } from "../../../graphql/generated/graphql";
import {
  createActionInputs,
  createDecisionInputs,
  createOptionInputs,
  createRoleInputs,
} from "../../../utils/processMutationHelpers";
import {
  FormOptionChoice,
  NewProcessState,
  ProcessRights,
} from "../../NewProcess/newProcessWizard";

export const createEditProcessMutation = (
  processId: string,
  oldFormState: NewProcessState,
  newFormState: NewProcessState,
): NewEditProcessRequestArgs => {
  const inputs: NewEditProcessRequestArgs = {
    processId: processId,
  };

  const diffForms = diff(oldFormState, newFormState) as NewProcessState;

  if (diffForms.name) {
    inputs["name"] = newFormState.name;
  }
  if (diffForms.description) {
    inputs["description"] = newFormState.description;
  }
  if (diffForms.action) {
    inputs["action"] = createActionInputs(newFormState.action);
  }

  if (diffForms.options || diffForms.customOptions) {
    inputs["options"] = createOptionInputs(
      newFormState.options as FormOptionChoice,
      newFormState.customOptions ?? [],
    ).map((option, index) => ({ ...option, id: index.toString() }));
  }

  if (diffForms.inputs) {
    inputs["inputs"] = oldFormState.inputs;
  }

  if (diffForms.rights?.request || diffForms.rights?.response) {
    inputs["roles"] = createRoleInputs(newFormState.rights as ProcessRights);
  }

  if (diffForms.decision) {
    inputs["decision"] = createDecisionInputs(newFormState.decision);
  }

  return inputs;
};

export default createEditProcessMutation;

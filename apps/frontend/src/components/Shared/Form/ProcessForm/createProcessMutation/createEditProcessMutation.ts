import { diff } from "deep-object-diff";

import { NewEditProcessRequestArgs } from "../../../../../graphql/generated/graphql";
import {
  createActionInputs,
  createDecisionInputs,
  createOptionInputs,
  createRoleInputs,
} from ".";
import { ProcessForm } from "@/components/shared/Form/ProcessForm/types";
import {
  FormOptionChoice,
  ProcessRights,
} from "@/components/shared/Form/ProcessForm/types";

export const createEditProcessMutation = (
  processId: string,
  oldFormState: ProcessForm,
  newFormState: ProcessForm,
): NewEditProcessRequestArgs => {
  const inputs: NewEditProcessRequestArgs = {
    processId: processId,
  };

  const diffForms = diff(oldFormState, newFormState) as ProcessForm;

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

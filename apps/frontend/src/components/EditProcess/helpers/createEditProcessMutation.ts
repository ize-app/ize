import { diff } from "deep-object-diff";

import { NewEditProcessRequestArgs } from "../../../graphql/generated/graphql";
import { formatOptions } from "../../NewProcess/newProcessMutationHelpers/formatOptions";
import { formatRoles } from "../../NewProcess/newProcessMutationHelpers/formatRoles";
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
  if (diffForms.webhookUri) {
    inputs["webhookUri"] = newFormState.webhookUri;
  }

  if (diffForms.options || diffForms.customOptions) {
    inputs["options"] = formatOptions(
      newFormState.options as FormOptionChoice,
      newFormState.customOptions ?? [],
    ).map((option, index) => ({ ...option, id: index.toString() }));
  }

  if (diffForms.inputs) {
    inputs["inputs"] = oldFormState.inputs;
  }

  if (diffForms.rights?.request || diffForms.rights?.response) {
    inputs["roles"] = formatRoles(newFormState.rights as ProcessRights);
  }

  if (diffForms.rights?.edit) {
    inputs["editProcessId"] = newFormState.rights?.edit.id;
  }

  if (diffForms.decision) {
    if (newFormState.decision?.decisionThresholdType === "Absolute") {
      inputs["absoluteDecision"] = {
        threshold: newFormState.decision?.decisionThreshold as number,
      };
    } else if (newFormState.decision?.decisionThresholdType === "Percentage") {
      inputs["percentageDecision"] = {
        quorum: newFormState.decision?.quorum as number,
        percentage: newFormState.decision?.decisionThreshold as number,
      };
    }
  }

  return inputs;
};

export default createEditProcessMutation;

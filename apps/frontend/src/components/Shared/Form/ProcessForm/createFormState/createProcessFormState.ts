import createActionFormState from "./createActionFormState";
import createDecisionFormState from "./createDecisionFormState";
import createInputsFormState from "./createInputsFormState";
import {
  createOptionFormState,
  getDefaultOptionSet,
} from "./createOptionsFormState";
import createRolesFormState from "./createRolesFormState";
import { ProcessSummaryPartsFragment } from "@/graphql/generated/graphql";
import {
  FormOptionChoice,
  NewProcessState,
} from "@/components/NewProcess/newProcessWizard";

const createProcessFormState = (
  process: ProcessSummaryPartsFragment,
): NewProcessState => {
  const defaultOption = getDefaultOptionSet(process.options);

  return {
    name: process.name,
    description: process.description ?? undefined,
    options: defaultOption,
    customOptions:
      defaultOption === FormOptionChoice.Custom
        ? createOptionFormState(process.options)
        : undefined,
    rights: createRolesFormState(process.roles),
    inputs: createInputsFormState(process.inputs),
    decision: createDecisionFormState(process.decisionSystem),
    action: createActionFormState(process.action ?? undefined),
  };
};

export default createProcessFormState;

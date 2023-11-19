import createActionFormState from "./createActionFormState";
import createDecisionFormState from "./createDecisionFormState";
import createInputsFormState from "./createInputsFormState";
import {
  createOptionFormState,
  getDefaultOptionSet,
} from "./createOptionsFormState";
import createRolesFormState from "./createRolesFormState";
import { ProcessSummaryPartsFragment } from "@/graphql/generated/graphql";
import { FormOptionChoice } from "@/components/shared/Form/ProcessForm/types";
import { ProcessForm } from "@/components/shared/Form/ProcessForm/types";

const createProcessFormState = (
  process: ProcessSummaryPartsFragment,
): ProcessForm => {
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
    decision: createDecisionFormState(
      process.decisionSystem,
      process.expirationSeconds,
    ),
    action: createActionFormState(process.action ?? undefined),
  };
};

export default createProcessFormState;

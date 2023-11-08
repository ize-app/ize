import { formatDecisionToFormState } from "./formatDecisionToFormState";
import { formatInputsToFormState } from "./formatInputsToFormState";
import {
  formatOptionsToFormState,
  getDefaultOptionSet,
} from "./formatOptionsToFormState";
import { formatRolesToFormState } from "./formatRolesToFormState";
import { ProcessSummaryPartsFragment } from "../../../graphql/generated/graphql";
import {
  FormOptionChoice,
  HasCustomIntegration,
  NewProcessState,
} from "../../NewProcess/newProcessWizard";

export const processToFormState = (
  process: ProcessSummaryPartsFragment,
): NewProcessState => {
  const defaultOption = getDefaultOptionSet(process.options);

  return {
    name: process.name,
    description: process.description ?? undefined,
    webhookUri: process.webhookUri ?? undefined,
    customIntegration: process.webhookUri
      ? HasCustomIntegration.Yes
      : HasCustomIntegration.No,
    options: defaultOption,
    customOptions:
      defaultOption === FormOptionChoice.Custom
        ? formatOptionsToFormState(process.options)
        : undefined,
    rights: formatRolesToFormState(process.roles),
    inputs: formatInputsToFormState(process.inputs),
    decision: formatDecisionToFormState(process.decisionSystem),
  };
};

import { diff } from "deep-object-diff";

import { createOptionInputs } from "../shared/Form/ProcessForm/createProcessMutation";
import {
  FormOptionChoice,
  NewProcessState,
} from "../NewProcess/newProcessWizard";
import { ProcessSnapshotForDiff } from "../shared/Request/EditProcessRequestsInputsTable";

const formatDiffDataForTable = (
  oldFormState: NewProcessState,
  newFormState: NewProcessState,
): [ProcessSnapshotForDiff, ProcessSnapshotForDiff] => {
  const currentProcess: ProcessSnapshotForDiff = {};
  const proposedChanges: ProcessSnapshotForDiff = {};

  const diffForms = diff(oldFormState, newFormState) as NewProcessState;

  if (diffForms?.name) {
    currentProcess["name"] = oldFormState.name;
    proposedChanges["name"] = newFormState.name;
  }
  if (diffForms.description) {
    currentProcess["description"] = oldFormState.description;
    proposedChanges["description"] = newFormState.description;
  }

  if (diffForms.options || diffForms.customOptions) {
    currentProcess["options"] = createOptionInputs(
      oldFormState.options as FormOptionChoice,
      oldFormState.customOptions ?? [],
    ).map((option, index) => ({ ...option, id: index.toString() }));
    proposedChanges["options"] = createOptionInputs(
      newFormState.options as FormOptionChoice,
      newFormState.customOptions ?? [],
    ).map((option, index) => ({ ...option, id: index.toString() }));
  }

  if (diffForms.inputs) {
    currentProcess["inputs"] = oldFormState.inputs;
    proposedChanges["inputs"] = newFormState.inputs;
  }

  if (diffForms.action) {
    currentProcess["action"] = oldFormState.action;
    proposedChanges["action"] = newFormState.action;
  }

  if (diffForms.rights?.request) {
    currentProcess["request"] = oldFormState.rights?.request;
    proposedChanges["request"] = newFormState.rights?.request;
  }
  if (diffForms.rights?.response) {
    currentProcess["respond"] = oldFormState.rights?.response;
    proposedChanges["respond"] = newFormState.rights?.response;
  }

  if (diffForms.decision) {
    currentProcess["decision"] = oldFormState.decision;
    proposedChanges["decision"] = newFormState.decision;
  }

  return [currentProcess, proposedChanges];
};

export default formatDiffDataForTable;

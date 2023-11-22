import { diff } from "deep-object-diff";
import { ProcessForm } from "../shared/Form/ProcessForm/types";
import { ProcessFormDisplayFields as DiffField } from "../shared/Form/ProcessForm/components/ProcessFormConfirmationTable";

const getEvolveDiffForDisplay = (
  process: ProcessForm,
  evolvedProcess: ProcessForm,
): DiffField[] => {
  const processDiff: ProcessForm = diff(process, evolvedProcess);

  const diffFields: DiffField[] = [];

  if (processDiff.name) diffFields.push(DiffField.Name);
  if (processDiff.description) diffFields.push(DiffField.Description);
  if (processDiff.customOptions || processDiff.options)
    diffFields.push(DiffField.Options);
  if (processDiff.decision) diffFields.push(DiffField.Decision);
  if (processDiff.action) diffFields.push(DiffField.Action);
  if (processDiff.inputs) diffFields.push(DiffField.Inputs);
  if (processDiff.rights?.request) diffFields.push(DiffField.Request);
  if (processDiff.rights?.response) diffFields.push(DiffField.Respond);

  if (processDiff.evolve?.rights?.request)
    diffFields.push(DiffField.RequestEvolve);
  if (processDiff.evolve?.rights?.response)
    diffFields.push(DiffField.RespondEvolve);
  if (processDiff.evolve?.decision) diffFields.push(DiffField.DecisionEvolve);

  return diffFields;
};

export default getEvolveDiffForDisplay;

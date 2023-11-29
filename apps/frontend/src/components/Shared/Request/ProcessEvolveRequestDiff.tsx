import { ProcessSummaryPartsFragment } from "@/graphql/generated/graphql";
import { ProcessFormConfirmationTable } from "../Form/ProcessForm/components/ProcessFormConfirmationTable";
import createProcessFormState from "../Form/ProcessForm/createFormState/createProcessFormState";
import getEvolveDiffForDisplay from "../Form/ProcessForm/helpers/getEvolveDiffForDisplay";

const ProcessEvolveRequestDiff = ({
  current,
  proposed,
}: {
  current: ProcessSummaryPartsFragment;
  proposed: ProcessSummaryPartsFragment;
}) => {
  const currFormat = createProcessFormState(current);
  const propFormat = createProcessFormState(proposed);

  return (
    <ProcessFormConfirmationTable 
      process={currFormat}
      evolvedProcess={propFormat}
      fields={getEvolveDiffForDisplay(currFormat, propFormat)}
    />
  );
};

export default ProcessEvolveRequestDiff;

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { FieldFragment, SystemFieldType, ValueFragment } from "@/graphql/generated/graphql";

import { Value } from "../Value/Value";

// renders name of the field and answer, if it exists.
// option fields show all options
export const Field = ({
  field,
  fieldAnswer,
  // onlyShowSelections = false,
}: {
  field: FieldFragment;
  fieldAnswer?: ValueFragment;
  onlyShowSelections?: boolean;
}) => {
  let fieldNameOverride: string | undefined = undefined;
  if (field.systemType === SystemFieldType.EvolveFlowCurrent) {
    fieldNameOverride = "Current flow (at the time of this request)";
  }
  return (
    <Box>
      <Typography variant="description">{fieldNameOverride ?? field.name}</Typography>
      {fieldAnswer && <Value value={fieldAnswer} field={field} type={"fieldAnswer"} />}
    </Box>
  );
};

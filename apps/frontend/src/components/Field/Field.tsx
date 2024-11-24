import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { FieldAnswerFragment, FieldFragment, FieldType } from "@/graphql/generated/graphql";

import { Answer } from "./Answer";
import { FieldOptions } from "./FieldOptions";
import { LabeledGroupedInputs } from "../Form/formLayout/LabeledGroupedInputs";

// renders name of the field and answer, if it exists.
// option fields show all options
export const Field = ({
  field,
  fieldAnswer,
  onlyShowSelections = false,
}: {
  field: FieldFragment;
  fieldAnswer?: FieldAnswerFragment | undefined;
  onlyShowSelections?: boolean;
}) => {
  switch (field.__typename) {
    case FieldType.FreeInput: {
      return (
        <Box>
          <Typography variant="description">
            {field.name}
            {/* <span style={{ fontStyle: "italic" }}> ({formatDataTypeName(field.dataType)})</span> */}
          </Typography>
          {fieldAnswer && <Answer field={field} fieldAnswer={fieldAnswer} />}
        </Box>
      );
    }
    case FieldType.Options: {
      const optionSelections =
        fieldAnswer && fieldAnswer.__typename === "OptionFieldAnswer"
          ? fieldAnswer.selections
          : undefined;
      return (
        <Box>
          <Typography color="primary" fontSize="1rem">
            {field.name}{" "}
            {/* <span style={{ fontStyle: "italic" }}>
              (
              {formatOptionSelectionType({
                type: field.selectionType,
                maxSelections: field.maxSelections,
              })}
              )
            </span> */}
          </Typography>
          <LabeledGroupedInputs label="Options" sx={{ backgroundColor: "white" }}>
            <FieldOptions
              onlyShowSelections={onlyShowSelections}
              fieldOptions={field}
              optionSelections={optionSelections}
              finalOptions={!!optionSelections} // TODO: revisit this
            />
          </LabeledGroupedInputs>
        </Box>
      );
    }
    default:
      return null;
  }
};

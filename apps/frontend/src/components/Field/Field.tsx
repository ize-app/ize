import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { FieldAnswerFragment, FieldFragment, FieldType } from "@/graphql/generated/graphql";

import { AnswerFreeInput } from "./AnswerFreeInput";
import { FieldOptions } from "./FieldOptions";
import { formatDataTypeName } from "./formatDataTypeName";
import { formatOptionSelectionType } from "./formatOptionSelectionType";

// renders name of the field and answer, if it exists.
// option fields show all options
export const Field = ({
  field,
  fieldAnswer,
}: {
  field: FieldFragment;
  fieldAnswer?: FieldAnswerFragment | undefined;
}) => {
  switch (field.__typename) {
    case FieldType.FreeInput: {
      const freeInputAnswer =
        fieldAnswer && fieldAnswer.__typename === "FreeInputFieldAnswer"
          ? fieldAnswer.value
          : undefined;
      return (
        <Box>
          <Typography color="primary" fontSize=".875rem">
            {field.name}
            <span style={{ fontStyle: "italic" }}> ({formatDataTypeName(field.dataType)})</span>
          </Typography>
          {freeInputAnswer && (
            <AnswerFreeInput answer={freeInputAnswer} dataType={field.dataType} />
          )}
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
          <Typography color="primary" fontSize=".875rem">
            {field.name}{" "}
            <span style={{ fontStyle: "italic" }}>
              (
              {formatOptionSelectionType({
                type: field.selectionType,
                maxSelections: field.maxSelections,
              })}
              )
            </span>
          </Typography>
          <FieldOptions
            fieldOptions={field}
            optionSelections={optionSelections}
            final={!!optionSelections} // TODO: revisit this
          />
        </Box>
      );
    }
    default:
      return null;
  }
};

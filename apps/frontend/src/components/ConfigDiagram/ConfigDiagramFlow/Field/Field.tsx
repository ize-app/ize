import { FieldAnswerFragment, FieldFragment, FieldType } from "@/graphql/generated/graphql";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FieldOptions } from "./FieldOptions";
import { renderFreeInputValue } from "./renderFreeInputValue";
import { formatDataTypeName } from "./formatDataTypeName";
import { formatOptionSelectionType } from "./formatOptionSelectionType";

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
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "4px",
                borderRadius: "4px",
                outline: "1px solid rgba(0, 0, 0, 0.1)",
                padding: "6px",
              }}
            >
              {renderFreeInputValue(freeInputAnswer, field.dataType)}
            </Box>
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

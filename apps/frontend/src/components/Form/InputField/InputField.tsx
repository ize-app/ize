import { Box, FormLabel } from "@mui/material";
import { FieldValues, Path, PathValue } from "react-hook-form";

import {
  FieldFragment,
  OptionSelectionType,
  SystemFieldType,
  ValueType,
} from "@/graphql/generated/graphql";

import { OptionSchemaType } from "./inputValidation";
import { DatePicker } from "../formFields/DatePicker";
import { DateTimePicker } from "../formFields/DateTimePicker";
import { EntitiesSearchField } from "../formFields/EntitiesSearchField";
import { FlowsSearchField } from "../formFields/FlowsSearchField";
import { MultiSelect } from "../formFields/MultiSelect";
import { Radio } from "../formFields/Radio";
import { SortableList } from "../formFields/SortableList";
import { TextField } from "../formFields/TextField";
import { LabeledGroupedInputs } from "../formLayout/LabeledGroupedInputs";

interface BaseInputProps<T extends FieldValues> {
  fieldName: Path<T>;
  label: string;
  disabled?: boolean;
  required?: boolean;
  showLabel: boolean;
  seperateLabel: boolean;
  groupId?: string;
}

interface FreeInputProps<T extends FieldValues> extends BaseInputProps<T> {
  type: "fieldAnswer";
  field: FieldFragment;
}

interface OptionInputProps<T extends FieldValues> extends BaseInputProps<T> {
  type: "newOption";
  option: OptionSchemaType;
}

type InputProps<T extends FieldValues> = FreeInputProps<T> | OptionInputProps<T>;

export const InputField = <T extends FieldValues>({
  fieldName,
  label,
  disabled,
  showLabel,
  seperateLabel,
  required = true,
  groupId,
  ...props
}: InputProps<T>) => {
  let type: ValueType;
  let systemFieldType: SystemFieldType | undefined = undefined;
  if (props.type === "fieldAnswer") {
    type = props.field.type;
    systemFieldType = props.field.systemType ?? undefined;
  } else type = props.option.input.type;

  switch (type) {
    case ValueType.Date:
      return (
        <DatePicker<T>
          name={fieldName}
          required={required}
          label={label}
          showLabel={showLabel}
          seperateLabel={seperateLabel}
        />
      );
    case ValueType.Uri:
      return (
        // TODO move this to its own component
        <Box>
          {showLabel && <FormLabel required={required}>{label}</FormLabel>}
          <LabeledGroupedInputs
            // label={label}
            sx={{ display: "flex", flexDirection: "column", width: "100%", padding: "8px" }}
          >
            <TextField<T>
              name={`${fieldName}.name` as Path<T>}
              defaultValue={"" as PathValue<T, Path<T>>}
              placeholderText={"Name of URL"}
              multiline
              label={label}
              required={required}
              disabled={disabled}
              showLabel={false}
              seperateLabel={false}
              size="small"
            />
            <TextField<T>
              name={`${fieldName}.uri` as Path<T>}
              defaultValue={"" as PathValue<T, Path<T>>}
              placeholderText={"URL"}
              multiline
              label={label}
              required={required}
              disabled={disabled}
              showLabel={false}
              seperateLabel={false}
              size="small"
            />
          </LabeledGroupedInputs>
        </Box>
      );
    case ValueType.DateTime:
      return (
        <DateTimePicker<T>
          name={fieldName}
          showLabel={showLabel}
          label={label}
          required={required}
          seperateLabel={seperateLabel}
        />
      );
    case ValueType.Entities:
      return (
        <EntitiesSearchField<T>
          required={required}
          name={fieldName}
          label={label}
          ariaLabel={label}
          hideIzeGroups={true}
          showLabel={showLabel}
          seperateLabel={seperateLabel}
        />
      );
    case ValueType.Flows:
      return (
        <FlowsSearchField<T>
          required={required}
          name={fieldName}
          ariaLabel={label}
          label={label}
          showLabel={showLabel}
          seperateLabel={seperateLabel}
          groupId={groupId}
          systemFieldType={systemFieldType}
        />
      );
    case ValueType.FlowVersion:
      throw Error("Flow version Id cannot be directly editted");
    case ValueType.OptionSelections: {
      if (props.type === "fieldAnswer") {
        const optionsConfig = props.field.optionsConfig;
        if (!optionsConfig) throw Error("OptionSelections field must have optionsConfig");
        const { options, selectionType, maxSelections } = optionsConfig;

        switch (selectionType) {
          case OptionSelectionType.Select: {
            // TODO: condense this to just one component
            if (maxSelections === 1) {
              return (
                <Radio<T>
                  name={`${fieldName}[0].optionId` as Path<T>}
                  label={label}
                  sx={{ flexDirection: "column", gap: "4px" }}
                  options={options}
                />
              );
            } else {
              return <MultiSelect<T> name={fieldName} label={label} options={options} />;
            }
          }
          case OptionSelectionType.Rank: {
            return <SortableList<T> label={label} name={fieldName} options={options} />;
          }
          default:
            throw Error("Unknown option selection type");
        }
      } else throw Error("Option input cannot have an options selection type");
    }
    default:
      return (
        <TextField<T>
          name={fieldName}
          defaultValue={"" as PathValue<T, Path<T>>}
          placeholderText={label}
          multiline
          label={label}
          required={required}
          disabled={disabled}
          showLabel={showLabel}
          seperateLabel={seperateLabel}
          size="small"
        />
      );
  }
};

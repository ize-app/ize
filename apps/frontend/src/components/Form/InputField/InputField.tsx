import { FieldValues, Path, PathValue } from "react-hook-form";

import {
  FieldDataType,
  FieldType,
  OptionSelectionType,
  SystemFieldType,
} from "@/graphql/generated/graphql";

import { DatePicker } from "../formFields/DatePicker";
import { DateTimePicker } from "../formFields/DateTimePicker";
import { EntitiesSearchField } from "../formFields/EntitiesSearchField";
import { FlowsSearchField } from "../formFields/FlowsSearchField";
import { MultiSelect } from "../formFields/MultiSelect";
import { Radio } from "../formFields/Radio";
import { SortableList } from "../formFields/SortableList";
import { TextField } from "../formFields/TextField";

interface OptionProps {
  label: string;
  value: string;
  dataType: FieldDataType;
}

interface BaseInputProps<T extends FieldValues> {
  fieldName: Path<T>;
  label: string;
  disabled?: boolean;
  required?: boolean;
}

interface FreeInputProps<T extends FieldValues> extends BaseInputProps<T> {
  type: FieldType.FreeInput;
  dataType: FieldDataType;
  showLabel?: boolean;
  seperateLabel?: boolean;
  groupId?: string;
  systemFieldType?: SystemFieldType | undefined | null;
}

interface OptionsInputProps<T extends FieldValues> extends BaseInputProps<T> {
  type: FieldType.Options;
  selectionType: OptionSelectionType;
  options: OptionProps[];
}

type InputProps<T extends FieldValues> = FreeInputProps<T> | OptionsInputProps<T>;

export const InputField = <T extends FieldValues>({
  fieldName,
  label,
  disabled,
  required = true,
  ...props
}: InputProps<T>) => {
  if (props.type === FieldType.FreeInput) {
    const { dataType, groupId, systemFieldType, showLabel, seperateLabel } = props;
    switch (dataType) {
      case FieldDataType.Date:
        return (
          <DatePicker<T>
            name={fieldName}
            required={required}
            label={label}
            showLabel={true}
            seperateLabel={true}
          />
        );
      case FieldDataType.DateTime:
        return (
          <DateTimePicker<T>
            name={fieldName}
            showLabel={showLabel}
            label={label}
            required={required}
            seperateLabel={seperateLabel}
          />
        );
      case FieldDataType.FlowVersionId:
        throw Error("Flow version Id cannot be directly editted");
      case FieldDataType.EntityIds:
        return (
          <EntitiesSearchField<T>
            required={required}
            name={fieldName}
            ariaLabel={label}
            hideIzeGroups={true}
            showLabel={showLabel}
            seperateLabel={seperateLabel}
          />
        );
      case FieldDataType.FlowIds:
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
  } else if (props.type === FieldType.Options) {
    const { options, selectionType } = props;

    switch (selectionType) {
      case OptionSelectionType.Select: {
        return (
          <Radio<T>
            name={`${fieldName}[0].optionId` as Path<T>}
            label={label}
            sx={{ flexDirection: "column", gap: "4px" }}
            options={options}
          />
        );
      }
      case OptionSelectionType.MultiSelect: {
        return (
          <MultiSelect<T>
            name={fieldName}
            label={label}
            sx={{ flexDirection: "column", gap: "4px" }}
            options={options}
          />
        );
      }
      case OptionSelectionType.Rank: {
        return <SortableList<T> label={label} name={fieldName} options={options} />;
      }
    }
  } else return null;
};

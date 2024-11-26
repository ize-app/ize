import { FieldPath, FieldValues, Path, PathValue } from "react-hook-form";

import {
  FieldDataType,
  FieldType,
  OptionSelectionType,
  SystemFieldType,
} from "@/graphql/generated/graphql";

import { DatePicker } from "./DatePicker";
import { DateTimePicker } from "./DateTimePicker";
import { EntitiesSearchField } from "./EntitiesSearchField";
import { FlowsSearchField } from "./FlowsSearchField";
import { MultiSelect } from "./MultiSelect";
import { Radio } from "./Radio";
import { SortableList } from "./SortableList";
import { TextField } from "./TextField";

interface OptionProps {
  label: string;
  value: string;
  dataType: FieldDataType;
}

interface BaseInputProps<T extends FieldValues> {
  fieldName: FieldPath<T>;
  label: string;
  disabled?: boolean;
  showLabel?: boolean;
  seperateLabel?: boolean;
  required?: boolean;
}

interface FreeInputProps<T extends FieldValues> extends BaseInputProps<T> {
  type: FieldType.FreeInput;
  dataType: FieldDataType;
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
    const { dataType, groupId, systemFieldType } = props;
    switch (dataType) {
      case FieldDataType.Date:
        return (
          <DatePicker<T>
            name={`${fieldName}.value` as Path<T>}
            required={required}
            label={label}
            showLabel={true}
            seperateLabel={true}
          />
        );
      case FieldDataType.DateTime:
        return (
          <DateTimePicker<T>
            name={`${fieldName}.value` as Path<T>}
            showLabel={false}
            label={label}
            required={required}
            seperateLabel={true}
          />
        );
      case FieldDataType.FlowVersionId:
        throw Error("Flow version Id cannot be directly editted");
      case FieldDataType.EntityIds:
        return (
          <EntitiesSearchField<T>
            name={`${fieldName}.value` as Path<T>}
            ariaLabel={label}
            hideIzeGroups={true}
            showLabel={true}
            seperateLabel={true}
          />
        );
      case FieldDataType.FlowIds:
        return (
          <FlowsSearchField<T>
            name={`${fieldName}.value` as Path<T>}
            ariaLabel={label}
            label={label}
            showLabel={true}
            seperateLabel={true}
            groupId={groupId}
            systemFieldType={systemFieldType}
          />
        );
      default:
        return (
          <TextField<T>
            name={`${fieldName}.value` as Path<T>}
            defaultValue={"" as PathValue<T, Path<T>>}
            placeholderText={label}
            showLabel={false}
            multiline
            label={label}
            disabled={disabled}
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
            name={`${fieldName}.optionSelections[0].optionId` as Path<T>}
            label={label}
            sx={{ flexDirection: "column", gap: "4px" }}
            options={options}
          />
        );
      }
      case OptionSelectionType.MultiSelect: {
        return (
          <MultiSelect<T>
            name={`${fieldName}.optionSelections` as Path<T>}
            label={label}
            sx={{ flexDirection: "column", gap: "4px" }}
            options={options}
          />
        );
      }
      case OptionSelectionType.Rank: {
        return (
          <SortableList<T>
            label={label}
            name={`${fieldName}.optionSelections` as Path<T>}
            options={options}
          />
        );
      }
    }
  } else return null;
};

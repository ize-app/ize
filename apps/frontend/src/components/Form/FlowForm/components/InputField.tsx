import { FieldPath, FieldValues, Path, PathValue, useFormContext } from "react-hook-form";

import { FieldDataType } from "@/graphql/generated/graphql";

import { DatePicker, DateTimePicker, TextField } from "../../formFields";

interface RenderInputProps<T extends FieldValues> {
  fieldName: FieldPath<T>;
  dataType: FieldDataType;
  label: string;
  disabled?: boolean;
}

export const InputField = <T extends FieldValues>({
  fieldName,
  dataType,
  label,
  disabled,
}: RenderInputProps<T>) => {
  const { control } = useFormContext<T>();

  switch (dataType) {
    case FieldDataType.Date:
      return (
        <DatePicker<T>
          name={fieldName}
          control={control}
          // showLabel={false}
          label={label}
          disabled={disabled}
        />
      );
    case FieldDataType.DateTime:
      return (
        <DateTimePicker<T>
          name={fieldName}
          control={control}
          showLabel={false}
          label={label}
          disabled={disabled}
        />
      );
    default:
      return (
        <TextField<T>
          name={fieldName}
          control={control}
          defaultValue={"" as PathValue<T, Path<T>>}
          placeholderText={label}
          showLabel={false}
          multiline
          // sx={{ flexGrow: 1 }}
          label={label}
          disabled={disabled}
          size="small"
        />
      );
  }
};

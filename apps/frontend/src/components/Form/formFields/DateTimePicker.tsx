import { FormLabel } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { DateTimePicker as MuiDateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

import { userTimezone } from "@/utils/timezone";

import { zodDay } from "../formValidation/field";

interface DateTimePickerProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  placeholderText?: string;
  seperateLabel?: boolean;
  size?: "small" | "medium";
}

export const DateTimePicker = <T extends FieldValues>({
  label,
  name,
  disabled = false,
  showLabel = true,
  seperateLabel = false,
  required = false,
}: DateTimePickerProps<T>) => {
  const labelText = label + " (" + userTimezone + ")";
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        if (!zodDay.safeParse(field.value).success) field.onChange(dayjs.utc());
        return (
          <FormControl error={Boolean(error)} required={required} sx={{ flexGrow: 1 }}>
            {showLabel && seperateLabel && <FormLabel>{labelText}</FormLabel>}
            <MuiDateTimePicker
              {...field}
              disabled={disabled}
              sx={{
                flexGrow: 1,
                "& .MuiInputBase-input": {
                  paddingBottom: "8.5px",
                  paddingTop: "8.5px",
                },
                "& .MuiFormLabel-root:not(.MuiInputLabel-shrink)": {
                  transform: "translate(14px, 8.5px) scale(1)",
                },
              }}
              aria-label={label}
              timezone={userTimezone}
              label={showLabel && !seperateLabel ? labelText : ""}
            />
            <FormHelperText
              sx={{
                color: "error.main",
              }}
            >
              {error?.message ?? ""}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

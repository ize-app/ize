import { FormLabel } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

import { zodDay } from "../formValidation/field";

interface DatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  placeholderText?: string;
  size?: "small" | "medium";
  seperateLabel?: boolean;
}

export const DatePicker = <T extends FieldValues>({
  label,
  name,
  showLabel = false,
  disabled = false,
  required = false,
  seperateLabel = false,
}: DatePickerProps<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        if (!zodDay.safeParse(field.value).success) field.onChange(dayjs.utc());
        return (
          <FormControl error={Boolean(error)} required={required}>
            {showLabel && seperateLabel && <FormLabel>{label}</FormLabel>}
            <MuiDatePicker
              {...field}
              value={field.value}
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
              timezone="system"
              label={showLabel && !seperateLabel ? label : ""}
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

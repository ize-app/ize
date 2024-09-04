import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import { zodDay } from "../formValidation/field";

interface DatePickerProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  required?: boolean;
  showLabel?: boolean;
  placeholderText?: string;
  size?: "small" | "medium";
}

export const DatePicker = <T extends FieldValues>({
  label,
  name,
  control,
  showLabel = false,
  required = false,
}: DatePickerProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        if (!zodDay.safeParse(field.value).success) field.onChange(dayjs.utc());
        return (
          <FormControl error={Boolean(error)} required={required}>
            <MuiDatePicker
              {...field}
              value={field.value}
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
              label={showLabel ? label : ""}
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

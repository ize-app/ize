import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import { DateTimePicker as MuiDateTimePicker, } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface DateTimePickerProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  required?: boolean;
  showLabel?: boolean;
  placeholderText?: string;
  size?: "small" | "medium";
}

export const DateTimePicker = <T extends FieldValues>({
  label,
  name,
  control,
  showLabel = true,
  required = false,
}: DateTimePickerProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl fullWidth error={Boolean(error)} required={required}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MuiDateTimePicker
                {...field}
                sx={{
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
            </LocalizationProvider>
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

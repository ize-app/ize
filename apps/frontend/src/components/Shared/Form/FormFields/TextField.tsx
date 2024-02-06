import { InputAdornment, TextField as MuiTextField, TextFieldVariants } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { ReactNode } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface TextFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  variant: TextFieldVariants;
  required?: boolean;
  showLabel?: boolean;
  width?: string;
  placeholderText?: string;
  endAdornment?: ReactNode;
  size?: "small" | "medium";
}

export const TextField = <T extends FieldValues>({
  label,
  name,
  control,
  variant,
  width = "100%",
  showLabel = true,
  required = false,
  size = "medium",
  endAdornment,
  placeholderText,
}: TextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl sx={{ width }} error={Boolean(error)} required={required}>
          {/* <OutlinedInput id="component-outlined" {...props} {...field} label={label} /> */}
          <MuiTextField
            {...field}
            aria-label={label}
            variant={variant}
            label={showLabel ? label : ""}
            required={required}
            size={size}
            placeholder={placeholderText}
            error={Boolean(error)}
            InputProps={{
              endAdornment,
            }}
          />
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {error?.message ?? ""}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

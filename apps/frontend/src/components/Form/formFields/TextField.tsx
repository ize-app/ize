import { TextField as MuiTextField, SxProps, TextFieldVariants } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { ReactNode } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface TextFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  variant?: TextFieldVariants;
  required?: boolean;
  showLabel?: boolean;
  placeholderText?: string;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  multiline?: boolean;
  rows?: number;
  size?: "small" | "medium";
  sx?: SxProps;
  display?: boolean;
  helperText?: string;
}

export const TextField = <T extends FieldValues>({
  label,
  name,
  control,
  showLabel = false,
  required = false,
  size = "small",
  multiline = false,
  variant = "outlined",
  rows,
  endAdornment,
  startAdornment,
  placeholderText,
  display = true,
  helperText,
  sx = {},
  ...props
}: TextFieldProps<T>) => {
  const defaultStyles: SxProps = { flexGrow: 1, display: display ? "flex" : "none" };
  const styles = { ...defaultStyles, ...(sx ?? {}) } as SxProps;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          sx={styles}
          error={Boolean(error)}
          required={required}
          disabled={props.disabled}
        >
          {/* <OutlinedInput id="component-outlined" {...props} {...field} label={label} /> */}
          <MuiTextField
            {...field}
            aria-label={label}
            variant={variant}
            label={showLabel ? label : ""}
            required={required}
            multiline={multiline}
            size={size}
            rows={rows}
            placeholder={placeholderText}
            error={Boolean(error)}
            disabled={props.disabled}
            InputProps={{
              endAdornment,
              startAdornment,
            }}
          />
          <FormHelperText
            sx={{
              color: error?.message ? "error.main" : undefined,
            }}
          >
            {error?.message ?? helperText ?? ""}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

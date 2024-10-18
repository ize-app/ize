import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
  SxProps,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { ReactNode } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type TextFieldProps<T extends FieldValues> = MuiTextFieldProps & {
  name: Path<T>;
  // label is overrideing the label in MuiTextFieldProps
  label: string;
  display?: boolean;
  showLabel?: boolean;
  placeholderText?: string;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
};

export const TextField = <T extends FieldValues>({
  label,
  name,
  showLabel = false,
  required = false,
  size = "small",
  multiline = false,
  variant = "outlined",
  disabled = false,
  rows,
  endAdornment,
  startAdornment,
  placeholderText,
  display = true,
  helperText,
  sx = {},
}: TextFieldProps<T>) => {
  const { control } = useFormContext<T>();
  const defaultStyles: SxProps = { flexGrow: 1, display: display ? "flex" : "none" };
  const styles = { ...defaultStyles, ...(sx ?? {}) } as SxProps;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl sx={styles} error={Boolean(error)} required={required} disabled={disabled}>
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
            disabled={disabled}
            InputProps={{
              endAdornment,
              startAdornment,
              multiline: true,
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

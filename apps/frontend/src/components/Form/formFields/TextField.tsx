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
  size?: "small" | "medium";
  sx?: SxProps;
}

export const TextField = <T extends FieldValues>({
  label,
  name,
  control,
  showLabel = false,
  required = false,
  size = "small",
  multiline = false,
  variant = "standard",
  endAdornment,
  startAdornment,
  placeholderText,
  sx = {},
}: TextFieldProps<T>) => {
  const defaultStyles: SxProps = { flexGrow: 0, width: "100%" };
  const styles = { ...defaultStyles, ...(sx ?? {}) } as SxProps;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl sx={styles} error={Boolean(error)} required={required}>
          {/* <OutlinedInput id="component-outlined" {...props} {...field} label={label} /> */}
          <MuiTextField
            {...field}
            aria-label={label}
            variant={variant}
            label={showLabel ? label : ""}
            required={required}
            multiline={multiline}
            size={size}
            placeholder={placeholderText}
            error={Boolean(error)}
            InputProps={{
              endAdornment,
              startAdornment,
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

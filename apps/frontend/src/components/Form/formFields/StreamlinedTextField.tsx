import { TextField as MuiTextField, SxProps } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { ReactNode } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface StreamlinedTextFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  required?: boolean;
  placeholderText?: string;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  multiline?: boolean;
  size?: "small" | "medium";
  sx?: SxProps;
}

export const StreamlinedTextField = <T extends FieldValues>({
  label,
  name,
  control,
  required = false,
  endAdornment,
  startAdornment,
  disabled,
  placeholderText,
  sx = {},
}: StreamlinedTextFieldProps<T>) => {
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
            variant={"standard"}
            required={required}
            disabled={disabled}
            size={"small"}
            placeholder={placeholderText}
            error={Boolean(error)}
            InputProps={{
              endAdornment,
              startAdornment,
            }}
          />
        </FormControl>
      )}
    />
  );
};

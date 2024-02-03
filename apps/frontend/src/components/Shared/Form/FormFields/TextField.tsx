import { TextField as MuiTextField, TextFieldVariants } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface TextFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  variant: TextFieldVariants;
  required?: boolean;
  placeholderText?: string;
}

export const TextField = <T extends FieldValues>({
  label,
  name,
  control,
  variant,
  required = false,
  placeholderText,
}: TextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={Boolean(error)} required={required}>
          {/* <OutlinedInput id="component-outlined" {...props} {...field} label={label} /> */}
          <MuiTextField
            {...field}
            aria-label={label}
            variant={variant}
            label={label}
            required={required}
            placeholder={placeholderText}
            error={Boolean(error)}
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

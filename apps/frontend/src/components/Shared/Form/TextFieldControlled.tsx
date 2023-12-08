import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput, { OutlinedInputProps } from "@mui/material/OutlinedInput";
import { Control, Controller } from "react-hook-form";

interface TextFieldControlProps extends OutlinedInputProps {
  name: string;
  control: Control;
}

export const TextFieldControl = ({
  name,
  label,
  control,
  required,
  ...props
}: TextFieldControlProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={Boolean(error)} required={required}>
          <InputLabel htmlFor="component-outlined">{label}</InputLabel>
          <OutlinedInput id="component-outlined" {...props} {...field} label={label} />
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

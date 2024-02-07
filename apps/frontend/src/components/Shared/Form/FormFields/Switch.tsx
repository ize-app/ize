import { FormControlLabel, TextField as MuiTextField, TextFieldVariants } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { default as MuiSwitch } from "@mui/material/Switch";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface SwitchProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  width?: string;
}

export const Switch = <T extends FieldValues>({
  label,
  name,
  control,
  width = "300px",
}: SwitchProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)} sx={{ width }}>
          {/* <OutlinedInput id="component-outlined" {...props} {...field} label={label} /> */}
          <FormControlLabel
            label={label}
            control={<MuiSwitch {...field} checked={field.value} />}
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

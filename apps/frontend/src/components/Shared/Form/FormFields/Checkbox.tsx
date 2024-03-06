import { FormControlLabel } from "@mui/material";
import { default as MuiCheckbox } from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface CheckboxProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
}

export const Checkbox = <T extends FieldValues>({
  name,
  label,
  control,
}: CheckboxProps<T>): JSX.Element => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl>
        <FormControlLabel
          value="top"
          control={
            <MuiCheckbox
              {...field}
              id={`checkbox-${name}`}
              checked={field.value as boolean}
              aria-label="label"
            />
          }
          label={label}
          labelPlacement="top"
        />
      </FormControl>
    )}
  />
);

import { default as MuiCheckbox } from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface CheckboxProps<T extends FieldValues> extends UseControllerProps<T> {}

export const Checkbox = <T extends FieldValues>({
  name,
  control,
}: CheckboxProps<T>): JSX.Element => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl>
        <MuiCheckbox {...field} id={`checkbox-${name}`} checked={field.value as boolean} />
      </FormControl>
    )}
  />
);

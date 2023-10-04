import FormControl from "@mui/material/FormControl";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";

import { Controller, Control } from "react-hook-form";

export interface CheckboxControlledProps extends CheckboxProps {
  name: string;
  control: Control;
}

export const CheckboxControlled = ({
  name,
  control,
  ...props
}: CheckboxControlledProps): JSX.Element => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormControl>
        <Checkbox
          {...props}
          {...field}
          id={`checkbox-${name}`}
          checked={field.value as boolean}
        />
      </FormControl>
    )}
  />
);

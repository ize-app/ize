import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { SelectProps } from "@mui/material/Select";

import { Controller, Control } from "react-hook-form";

export interface SelectControlledProps extends SelectProps {
  name: string;
  control: Control;
  label: string;
  selectOptions: string[];
  selectOption: string;
}

export const SelectControlled = ({
  name,
  control,
  label,
  selectOptions,
  ...props
}: SelectControlledProps): JSX.Element => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <FormControl>
        <InputLabel id={`select-${name}`}>{label}</InputLabel>
        <MuiSelect
          {...props}
          {...field}
          labelId={`select-${name}`}
          id={`select-${name}`}
          label={label}
        >
          {selectOptions.map((option, index) => (
            <MenuItem key={`${option + index.toString()}`} value={option}>
              {option}
            </MenuItem>
          ))}
        </MuiSelect>
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

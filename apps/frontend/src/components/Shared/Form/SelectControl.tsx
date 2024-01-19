import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { SelectProps } from "@mui/material/Select";
import { Control, Controller } from "react-hook-form";
import Loading from "../Loading";

export interface SelectOption {
  name: string;
  value: string | number | undefined;
}

export interface SelectControlProps extends SelectProps {
  name: string;
  control: Control;
  label: string;
  selectOptions: SelectOption[];
  selectOption?: SelectOption;
  loading?: boolean;
}

export const SelectControl = ({
  name,
  control,
  label,
  selectOptions,
  loading = false,
  ...props
}: SelectControlProps): JSX.Element => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => {
      return (
        <FormControl fullWidth>
          <InputLabel id={`select-${name}`}>{label}</InputLabel>
          <MuiSelect
            {...props}
            {...field}
            labelId={`select-${name}`}
            id={`select-${name}`}
            label={label}
          >
            {loading ? (
              <Loading />
            ) : (
              selectOptions.map((option, index) => (
                <MenuItem key={`${option.name + index.toString()}`} value={option.value}>
                  {option.name}
                </MenuItem>
              ))
            )}
          </MuiSelect>
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {error?.message ?? ""}
          </FormHelperText>
        </FormControl>
      );
    }}
  />
);

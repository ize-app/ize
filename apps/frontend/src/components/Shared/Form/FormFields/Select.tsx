import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import Loading from "../../Loading";

export interface SelectOption {
  name: string;
  value: string | number | undefined;
}

interface SelectProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  displayLabel?: boolean;
  selectOptions: SelectOption[];
  width: string;
  required?: boolean;
  loading?: boolean;
  size?: "small" | "medium";
}

export const Select = <T extends FieldValues>({
  name,
  control,
  label,
  width,
  selectOptions,
  displayLabel = true,
  required = false,
  loading = false,
  size = "medium",
  ...props
}: SelectProps<T>): JSX.Element => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => {
      return (
        <FormControl sx={{ width, textAlign: "left" }} error={Boolean(error)} required={required}>
          <InputLabel id={`select-${name}`}>{displayLabel ? label : ""}</InputLabel>
          <MuiSelect
            {...props}
            autoWidth={true}
            {...field}
            label={displayLabel ? label : ""}
            aria-label={label}
            size={size}
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

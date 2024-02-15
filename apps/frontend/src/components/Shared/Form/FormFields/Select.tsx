import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, FieldValues, Path, PathValue, UseControllerProps } from "react-hook-form";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import Loading from "../../Loading";
import { TextFieldVariants } from "@mui/material";
import { ReactNode } from "react";

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
  variant?: TextFieldVariants;
  renderValue?: (value: PathValue<T, Path<T>>) => ReactNode;
  size?: "small" | "medium";
}

export const Select = <T extends FieldValues>({
  name,
  control,
  label,
  width,
  selectOptions,
  renderValue,
  displayLabel = false,
  required = false,
  loading = false,
  variant = "standard",
  size = "small",
  ...props
}: SelectProps<T>): JSX.Element => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => {
      return (
        <FormControl sx={{ width, textAlign: "left" }} error={Boolean(error)} required={required}>
          {displayLabel && <InputLabel id={`select-${name}`}>{label}</InputLabel>}
          <MuiSelect
            {...props}
            autoWidth={true}
            {...field}
            label={displayLabel ? label : ""}
            aria-label={label}
            size={size}
            renderValue={renderValue}
            variant={variant}
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

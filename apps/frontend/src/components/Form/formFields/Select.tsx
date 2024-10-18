import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { SelectProps as MuiSelectProps } from "@mui/material/Select";
import { ReactNode } from "react";
import { Controller, FieldValues, Path, PathValue, useFormContext } from "react-hook-form";

import Loading from "../../Loading";
export interface SelectOption {
  name: string;
  value: string | number | undefined;
}

type SelectProps<T extends FieldValues> = MuiSelectProps & {
  name: Path<T>;
  // label is overrideing the label in MuiSelectProps
  label: string;
  // onChange also overriding the onChange in MuiSelectProps
  onChange?: () => void;
  renderValue?: (value: PathValue<T, Path<T>>) => ReactNode;
  selectOptions: SelectOption[];
  loading?: boolean;
  display?: boolean;
};

export const Select = <T extends FieldValues>({
  name,
  label,
  sx = {},
  selectOptions,
  displayEmpty = false,
  renderValue,
  required = false,
  loading = false,
  onChange,
  variant = "outlined",
  size = "small",
  display = true,
  // ...props
}: SelectProps<T>): JSX.Element => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl
            sx={{ textAlign: "left", flexGrow: 1, display: display ? "flex" : "none", ...sx }}
            error={Boolean(error)}
            required={required}
          >
            {/* {<InputLabel id={`select-${name}`}>{label}</InputLabel>} */}
            <MuiSelect
              // {...props}

              autoWidth={true}
              inputProps={{ multiline: "true" }}
              {...field}
              label={""}
              onChange={(e) => {
                field.onChange(e.target.value);

                if (onChange) onChange();
              }}
              aria-label={label}
              size={size}
              renderValue={renderValue}
              variant={variant}
              displayEmpty={displayEmpty}
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
};

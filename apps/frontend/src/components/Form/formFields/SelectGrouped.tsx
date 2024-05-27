import { ListSubheader, TextFieldVariants } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import { ReactNode } from "react";
import { Controller, FieldValues, Path, PathValue, UseControllerProps } from "react-hook-form";

import Loading from "../../Loading";

export interface SelectOption {
  name: string;
  value: string | number | undefined;
}

export interface SelectOptionGroup {
  name: string;
  options: SelectOption[];
}

interface SelectGroupedProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  displayLabel?: boolean;
  selectOptionGroups: SelectOptionGroup[];
  width: string;
  required?: boolean;
  loading?: boolean;
  variant?: TextFieldVariants;
  renderValue?: (value: PathValue<T, Path<T>>) => ReactNode;
  size?: "small" | "medium";
  flexGrow?: string;
}

export const SelectGrouped = <T extends FieldValues>({
  name,
  control,
  label,
  width,
  selectOptionGroups,
  renderValue,
  displayLabel = false,
  required = false,
  loading = false,
  variant = "standard",
  size = "small",
  flexGrow = "0",

  ...props
}: SelectGroupedProps<T>): JSX.Element => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState: { error } }) => {
      return (
        <FormControl
          sx={{ width, textAlign: "left", flexGrow }}
          error={Boolean(error)}
          required={required}
        >
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
              selectOptionGroups.map((group, index) => (
                <>
                  <ListSubheader key={group.name + index.toString()}>{group.name}</ListSubheader>
                  {group.options.map((option, index) => {
                    return (
                      <MenuItem key={`${option.name + index.toString()}`} value={option.value}>
                        {option.name}
                      </MenuItem>
                    );
                  })}
                </>
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

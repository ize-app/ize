import { SxProps } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";

import { useWatch } from "react-hook-form";

interface MultiSelectProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string;
  disabled?: boolean;
  options: OptionProps[];
  sx: SxProps;
}

export interface OptionProps {
  value: string;
  label: string;
}

export const MultiSelect = <T extends FieldValues>({
  control,
  label,
  name,
  options,
  ...rest
}: MultiSelectProps<T>) => {
  const checkboxIds = useWatch({ control, name: name }) || [];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, value, onChange, ...inputProps }, fieldState: { error } }) => {
        const handleChange = (value: string) => {
          const newArray: string[] = [...checkboxIds];
          const item = value;

          if (newArray.length > 0) {
            const index = newArray.findIndex((x) => x === item);

            if (index === -1) {
              newArray.push(item);
            } else {
              newArray.splice(index, 1);
            }
          } else {
            newArray.push(item);
          }

          onChange(newArray);
        };

        return (
          <FormControl>
            {label ? (
              <FormLabel component="legend" id="multiselect-options-form">
                {label}
              </FormLabel>
            ) : null}

            <FormGroup>
              {options.map((option) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={value?.some((checked: string) => checked === option.value)}
                      {...inputProps}
                      inputRef={ref}
                      key={"checkbox-" + option.value}
                      onChange={() => handleChange(option.value)}
                      disabled={rest?.disabled}
                    />
                  }
                  label={<p className="body2">{option.label}</p>}
                  key={option.value}
                />
              ))}
            </FormGroup>
            <FormHelperText error variant="outlined">
              {error?.message ?? ""}
            </FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

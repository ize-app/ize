import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { SxProps } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { Controller, FieldValues, Path, useFormContext, useWatch } from "react-hook-form";

import { Value } from "@/components/Value/Value";
import { OptionFragment } from "@/graphql/generated/graphql";

import {
  OptionSelectionValueSchemaType,
  OptionSelectionValuesSchemaType,
} from "../InputField/inputValidation";

interface MultiSelectProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  disabled?: boolean;
  options: OptionFragment[];
  sx: SxProps;
}

export const MultiSelect = <T extends FieldValues>({
  label,
  name,
  options,
  ...rest
}: MultiSelectProps<T>) => {
  const { control } = useFormContext<T>();
  const selectedOptions = useWatch({ control, name: name }) || [];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, value, onChange, ...inputProps }, fieldState: { error } }) => {
        const handleChange = (value: OptionFragment) => {
          const newArray: OptionSelectionValuesSchemaType = [...selectedOptions];
          const item = value;

          if (newArray.length > 0) {
            const index = newArray.findIndex((x) => x.optionId === item.optionId);

            if (index === -1) {
              newArray.push({ optionId: item.optionId });
            } else {
              newArray.splice(index, 1);
            }
          } else {
            newArray.push({ optionId: item.optionId });
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
                      //eslint-disable-next-line
                      checked={value?.some(
                        (checked: OptionSelectionValueSchemaType) =>
                          checked.optionId === option.optionId,
                      )}
                      checkedIcon={<CheckCircleIcon fontSize="small" />}
                      icon={<RadioButtonUncheckedIcon fontSize="small" />}
                      {...inputProps}
                      inputRef={ref}
                      key={"checkbox-" + option.optionId}
                      onChange={() => handleChange(option)}
                      disabled={rest?.disabled}
                    />
                  }
                  label={<Value value={option.value} type="option" />}
                  key={option.optionId}
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

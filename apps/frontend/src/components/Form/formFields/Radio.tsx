import { SxProps } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { default as MuiRadio } from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

import { FreeInputValue } from "@/components/Field/FreeInputValue";
import { FieldDataType } from "@/graphql/generated/graphql";

interface RadioProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  disabled?: boolean;
  options: OptionProps[];
  sx: SxProps;
}

export interface OptionProps {
  value: string;
  label: string;
  dataType: FieldDataType;
}

export const Radio = <T extends FieldValues>({
  name,
  label,
  options,
  disabled = false,
  ...props
}: RadioProps<T>): JSX.Element => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" required disabled={disabled}>
          {label ? (
            <FormLabel component="legend" id="radio-buttons-group-options">
              {label}
            </FormLabel>
          ) : null}
          <RadioGroup
            {...field}
            {...props}
            row
            //   defaultValue={defaultValue}
            aria-labelledby="radio-buttons-group-options"
            name="row-radio-buttons-group-options"
          >
            {options.map((elem, index) => (
              <FormControlLabel
                value={elem.value}
                key={"option" + index.toString()}
                control={<MuiRadio size="small" />}
                label={<FreeInputValue value={elem.label} type={elem.dataType} />}
              />
            ))}
          </RadioGroup>
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
};

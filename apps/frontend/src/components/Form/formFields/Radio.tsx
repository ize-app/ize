import { SxProps } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { default as MuiRadio } from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

import { Value } from "@/components/Value/Value";
import { OptionFragment } from "@/graphql/generated/graphql";

interface RadioProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  disabled?: boolean;
  options: OptionFragment[];
  required: boolean;
  sx: SxProps;
}

export const Radio = <T extends FieldValues>({
  name,
  label,
  options,
  required,
  disabled = false,
  ...props
}: RadioProps<T>): JSX.Element => {
  const { control, watch } = useFormContext<T>();

  // creating a fallback value to avoid "component switching from uncontrolled to controlled" error
  const currentValue = watch(name) ?? "";
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" required={required} disabled={disabled}>
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
            value={currentValue}
            aria-labelledby="radio-buttons-group-options"
            name="row-radio-buttons-group-options"
          >
            {options.map((elem, index) => (
              <FormControlLabel
                value={elem.optionId}
                key={"option" + index.toString()}
                control={<MuiRadio size="small" />}
                label={<Value value={elem.value} type="option" />}
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

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";
import { Control, Controller } from "react-hook-form";

export interface RadioControlProps extends RadioGroupProps {
  name: string;
  control: Control;
  label?: string;
  disabled?: boolean;
  defaultValue?: string;
  options: { value: string; label: string }[];
}

export const RadioControl = ({
  name,
  control,
  label,
  options,
  defaultValue,
  disabled = false,
  ...props
}: RadioControlProps): JSX.Element => (
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
          defaultValue={defaultValue}
          aria-labelledby="radio-buttons-group-options"
          name="row-radio-buttons-group-options"
        >
          {options.map((elem, index) => (
            <FormControlLabel
              value={elem.value}
              key={"option" + index.toString()}
              control={<Radio />}
              label={elem.label}
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

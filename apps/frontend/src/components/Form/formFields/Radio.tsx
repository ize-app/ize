import { SxProps } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { default as MuiRadio } from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface RadioProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string;
  disabled?: boolean;
  options: OptionProps[];
  sx: SxProps;
}

export interface OptionProps {
  value: string;
  label: string;
}

export const Radio = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled = false,
  ...props
}: RadioProps<T>): JSX.Element => (
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
              control={<MuiRadio />}
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

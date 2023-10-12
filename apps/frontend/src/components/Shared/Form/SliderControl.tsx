import Slider, { SliderProps } from "@mui/material/Slider";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";

import { Controller, Control } from "react-hook-form";

interface SliderControlProps extends SliderProps {
  control: Control;
  name: string;
  max: number;
}

export const SliderControl = ({
  control,
  name,
  max,
  ...props
}: SliderControlProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <Slider
            onChange={(_, value) => {
              field.onChange(value);
            }}
            valueLabelDisplay="auto"
            value={field.value as number}
            max={max}
            step={1}
            {...props}
          />
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {error?.message ?? ""}
          </FormHelperText>
        </>
      )}
    />
  );
};

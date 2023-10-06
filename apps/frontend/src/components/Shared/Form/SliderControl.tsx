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
      defaultValue={[0, 10]}
      render={({ field, fieldState: { error } }) => (
        <>
          <Slider
            {...props}
            onChange={(_, value) => {
              field.onChange(value);
            }}
            valueLabelDisplay="auto"
            max={max}
            step={1}
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

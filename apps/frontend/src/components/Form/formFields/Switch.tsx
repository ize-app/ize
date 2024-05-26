import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { default as MuiSwitch } from "@mui/material/Switch";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import { SxProps } from "@mui/material";

interface SwitchProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  sx?: SxProps;
}

export const Switch = <T extends FieldValues>({
  label,
  name,
  control,
  sx = {},
}: SwitchProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)} sx={sx}>
          <FormControlLabel
            label={label}
            control={<MuiSwitch {...field} checked={field.value} />}
          />
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

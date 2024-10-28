import { SxProps } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { default as MuiSwitch } from "@mui/material/Switch";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

interface SwitchProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  sx?: SxProps;
}

export const Switch = <T extends FieldValues>({ label, name, sx = {} }: SwitchProps<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)} sx={sx}>
          <FormControlLabel
            label={label}
            slotProps={{ typography: { fontSize: ".875rem" } }}
            control={<MuiSwitch {...field} checked={field.value} size="small" />}
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

import { Box, FormHelperText, SxProps, TextFieldVariants } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

interface AsyncSelectProps<T extends FieldValues, OptionType> extends UseControllerProps<T> {
  label: string;
  loading: boolean;
  fetchOptions: () => Promise<void> | void;
  options: OptionType[];
  isOptionEqualToValue: (option: OptionType, value: OptionType) => boolean;
  getOptionLabel: (option: OptionType) => string;
  variant?: TextFieldVariants;
  showLabel?: boolean;
  sx?: SxProps;
}

export default function AsyncSelect<T extends FieldValues, OptionType>({
  label,
  showLabel,
  name,
  loading,
  fetchOptions,
  options,
  isOptionEqualToValue,
  getOptionLabel,
  variant = "outlined",
  control,
  sx = {},
  ...props
}: AsyncSelectProps<T, OptionType>) {
  const [open, setOpen] = React.useState(false);

  // fetch on load
  const handleOpen = async () => {
    setOpen(true);
    await fetchOptions();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Autocomplete
              sx={{ width: 300, ...sx }}
              size="small"
              {...field}
              {...props}
              open={open}
              onOpen={handleOpen}
              onClose={handleClose}
              isOptionEqualToValue={isOptionEqualToValue}
              getOptionLabel={getOptionLabel}
              options={options}
              onChange={(_event, data) => field.onChange(data)}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="ignore"
                  placeholder={label}
                  label={showLabel ? label : ""}
                  aria-label={label}
                  variant={variant}
                  autoComplete="off"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
            <FormHelperText
              sx={{
                color: error?.message ? "error.main" : undefined,
              }}
            >
              {error?.message}
            </FormHelperText>
          </Box>
        );
      }}
    />
  );
}

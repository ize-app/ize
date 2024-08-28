import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Controller, FieldPath, FieldValues, UseControllerProps } from "react-hook-form";

interface ButtonGroupFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  name: FieldPath<T>;
  label: string;
  options: { value: string; name: string; icon?: string }[];
}

export const ButtonGroupField = <T extends FieldValues>({
  name,
  control,
  options,
}: ButtonGroupFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <ToggleButtonGroup
            {...field}
            onChange={(_event: React.MouseEvent<HTMLElement>, value: string) => {
              field.onChange(value);
            }}
            // fullWidth
            size="small"
            sx={{
              flexWrap: "wrap",
              //   display: "flex",
              //   flexDirection: "row",
              //   justifyContent: "center",
              gap: "12px",

              "& .MuiToggleButtonGroup-middleButton": {
                border: "1px solid rgba(0, 0, 0, 0.12)",
              },
              "& .MuiToggleButtonGroup-lastButton": {
                border: "1px solid rgba(0, 0, 0, 0.12)",
              },
            }}
            exclusive
            aria-label="text alignment"
          >
            {options.map((option) => (
              <ToggleButton
                key={option.value}
                value={option.value}
                size="small"
                aria-label={option.name}
                color="primary"
                sx={{ width: "140px" }} // Modify this line to add a single solid border
              >
                <span>{option.name}</span>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        );
      }}
    />
  );
};

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
// import FormHelperText from "@mui/material/FormHelperText";
// import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

// import { RadioControl } from "../Form";
// import { Control } from "react-hook-form";

export const RequestOptions = ({
  options,
  handleChange,
}: {
  options: string[];
  handleChange: () => void;
}) => {
  return (
    <FormControl component="fieldset" required>
      <RadioGroup
        // row
        aria-labelledby="radio-buttons-group-options"
        name="row-radio-buttons-group-options"
        onChange={handleChange}
        sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        {options.map((option, index) => (
          <FormControlLabel
            value={option}
            key={"option" + index.toString()}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
      {/* <FormHelperText
        sx={{
          color: "error.main",
        }}
      >
        {error?.message ?? ""}
      </FormHelperText> */}
    </FormControl>
  );
};

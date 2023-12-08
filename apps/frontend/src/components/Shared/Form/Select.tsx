import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select";

export interface SelectProps {
  selectOptions: string[];
  selectOption: string;
  onChange: (event: SelectChangeEvent) => void;
}

export const Select = ({ selectOptions, selectOption, onChange }: SelectProps): JSX.Element => (
  <FormControl sx={{ width: "200px" }}>
    <MuiSelect
      labelId="select-filter"
      id="select-filter"
      value={selectOption}
      size="small"
      onChange={onChange}
    >
      {selectOptions.map((option, index) => (
        <MenuItem key={`${option + index.toString()}`} value={option}>
          {option}
        </MenuItem>
      ))}
    </MuiSelect>
  </FormControl>
);

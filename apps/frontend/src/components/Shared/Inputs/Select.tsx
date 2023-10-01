import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select";

interface FilterProps {
  selectOptions: string[];
  selectOption: string;
  changeHandler: (event: SelectChangeEvent) => void;
}

const Select = ({
  selectOptions,
  selectOption,
  changeHandler,
}: FilterProps): JSX.Element => (
  <FormControl sx={{ width: "200px" }}>
    <MuiSelect
      labelId="select-filter"
      id="select-filter"
      value={selectOption}
      size="small"
      onChange={changeHandler}
    >
      {selectOptions.map((option) => (
        <MenuItem value={option}>{option}</MenuItem>
      ))}
    </MuiSelect>
  </FormControl>
);

export default Select;

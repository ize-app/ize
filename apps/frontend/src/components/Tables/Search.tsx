import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

interface SearchProps {
  searchQuery: string;
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({ searchQuery, changeHandler }: SearchProps) => {
  return (
    <TextField
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          borderRadius: "100px",
        },
        minWidth: "140px",
      }}
      id="search"
      type="search"
      value={searchQuery}
      size="small"
      onChange={changeHandler}
      placeholder="Search"
      fullWidth={true}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default Search;

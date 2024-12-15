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
      sx={(theme) => ({
        "& .MuiOutlinedInput-notchedOutline": {
          borderRadius: "100px",
        },
        "& .MuiOutlinedInput-input": {
          padding: "4px",
        },
        minWidth: "140px",
        width: "100%",
        maxWidth: "400px",
        [theme.breakpoints.down("sm")]: {
          maxWidth: "220px",
        },
      })}
      id="search"
      type="search"
      value={searchQuery}
      size="small"
      onChange={changeHandler}
      // variant="standard"
      placeholder="Search"
      // fullWidth={true}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default Search;

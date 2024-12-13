import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ReactElement, useState } from "react";

export const FilterMenu = ({ toggleButtons }: { toggleButtons: ReactElement[] }): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        aria-label="Filter menu button"
        sx={{
          borderRadius: "4px",
          border: `1px solid #B69DF8`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={handleClick}
      >
        <FilterAltIcon fontSize="small" sx={{ color: "#B69DF8" }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="filter menu"
        aria-label="Filter menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        autoFocus={false}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {toggleButtons.map((button, index) => (
          <MenuItem key={"togglebutton" + index}>{button}</MenuItem>
        ))}
      </Menu>
    </>
  );
};

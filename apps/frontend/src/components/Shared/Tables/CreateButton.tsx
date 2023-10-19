import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { Menu, MenuItem } from "@mui/material";

import { useState } from "react";
import { Link } from "react-router-dom";

import {
  NewRequestRoute,
  NewProcessRoute,
  newProcessRoute,
  newRequestRoute,
} from "../../../routers/routes";

const CreateButton = (): JSX.Element => {
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
        sx={{
          borderRadius: "100px",
          border: "1px solid",
          height: "40px",
          width: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minWidth: "40px",
          backgroundColor: "primary.main",
          color: "white",
          "&&:hover": {
            backgroundColor: "#B69DF8",
          },
        }}
        onClick={handleClick}
      >
        <Add />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        autoFocus={false}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Link to={newRequestRoute(NewRequestRoute.SelectProcess)}>
            New request
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to={newProcessRoute(NewProcessRoute.Intro)}>New process</Link>
        </MenuItem>
      </Menu>
    </>
  );
};

export default CreateButton;

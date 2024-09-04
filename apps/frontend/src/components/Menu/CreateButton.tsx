import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  NewCustomGroupRoute,
  NewFlowRoute,
  NewRequestRoute,
  newCustomGroupRoute,
  newFlowRoute,
  newRequestRoute,
} from "../../routers/routes";

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
      <CreateMenu handleClose={handleClose} open={open} anchorEl={anchorEl} />
    </>
  );
};

export const CreateListButton = (): JSX.Element => {
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
        onClick={handleClick}
        variant="contained"
        size="small"
        // endIcon={<Add />}
        sx={{ width: "100%", margin: "8px 8px" }}
      >
        Create
      </Button>
      <CreateMenu handleClose={handleClose} open={open} anchorEl={anchorEl} />
    </>
  );
};

export const CreateMenu = ({
  handleClose,
  open,
  anchorEl,
}: {
  handleClose: () => void;
  open: boolean;
  anchorEl: HTMLElement | null;
}) => {
  return (
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
        <Link to={newRequestRoute(NewRequestRoute.SelectFlow)}>New request</Link>
      </MenuItem>
      <MenuItem>
        <Link to={newFlowRoute(NewFlowRoute.InitialSetup)}>New flow</Link>
      </MenuItem>
      <MenuItem>
        <Link to={newCustomGroupRoute(NewCustomGroupRoute.Setup)}>New group</Link>
      </MenuItem>
    </Menu>
  );
};

export default CreateButton;

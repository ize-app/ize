import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ToggleButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Dispatch, SetStateAction, useState } from "react";

import { RequestStatusFilter } from "@/graphql/generated/graphql";

const statusFilterOptions: { name: string; value: RequestStatusFilter }[] = [
  {
    name: "Open",
    value: RequestStatusFilter.Open,
  },
  {
    name: "Final results",
    value: RequestStatusFilter.Final,
  },
  {
    name: "All",
    value: RequestStatusFilter.All,
  },
];

export const RequestStatusToggle = ({
  requestStatusFilter,
  setRequestStatusFilter,
}: {
  requestStatusFilter: RequestStatusFilter;
  setRequestStatusFilter: Dispatch<SetStateAction<RequestStatusFilter>>;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleHandler = ({ type }: { type: RequestStatusFilter }) => {
    setRequestStatusFilter(type);
    handleClose();
  };

  return (
    <>
      <ToggleButton
        size="small"
        value={"Watched by me"}
        selected={true}
        sx={(theme) => ({
          height: "30px",
          display: "flex",
          justifyContent: "space-between",
          [theme.breakpoints.down("sm")]: {
            width: "100%",
          },
        })}
        color="primary"
        onClick={handleClick}
        onChange={() => {
          //   setWatchedByUser(!watchedByUser);
        }}
      >
        {statusFilterOptions.find((option) => option.value === requestStatusFilter)?.name}
        <ArrowDropDownIcon />
      </ToggleButton>
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
        {statusFilterOptions.map((option) => (
          <MenuItem key={option.value} onClick={() => toggleHandler({ type: option.value })}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

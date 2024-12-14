import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ToggleButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Dispatch, SetStateAction, useState } from "react";

import { GroupWatchFilter } from "@/graphql/generated/graphql";

const watchFilterOptions: { name: string; value: GroupWatchFilter }[] = [
  {
    name: "Watched",
    value: GroupWatchFilter.Watched,
  },
  {
    name: "Not watched",
    value: GroupWatchFilter.NotWatched,
  },
  {
    name: "All",
    value: GroupWatchFilter.All,
  },
];

export const GroupWatchFilterToggle = ({
  watchFilter,
  setWatchFilter,
}: {
  watchFilter: GroupWatchFilter;
  setWatchFilter: Dispatch<SetStateAction<GroupWatchFilter>>;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleHandler = ({ type }: { type: GroupWatchFilter }) => {
    setWatchFilter(type);
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
      >
        {watchFilterOptions.find((option) => option.value === watchFilter)?.name}
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
        {watchFilterOptions.map((option, index) => (
          <MenuItem
            key={"watchFilter" + index}
            onClick={() => toggleHandler({ type: option.value })}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

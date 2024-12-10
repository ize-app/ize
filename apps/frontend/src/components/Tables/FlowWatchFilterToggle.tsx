import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ToggleButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Dispatch, SetStateAction, useState } from "react";

import { FlowWatchFilter } from "@/graphql/generated/graphql";

const flowFilterOptions: { name: string; value: FlowWatchFilter }[] = [
  {
    name: "Watched by me or my groups",
    value: FlowWatchFilter.WatchedByMeOrMyGroups,
  },
  { name: "Watched by me", value: FlowWatchFilter.WatchedByMe },
  { name: "Not watched", value: FlowWatchFilter.NotWatching },
  { name: "All", value: FlowWatchFilter.All },
];

export const FlowWatchFilterToggle = ({
  flowWatchFilter,
  setWatchFlowFilter,
  showWatchedByGroupsOption,
}: {
  flowWatchFilter: FlowWatchFilter;
  setWatchFlowFilter: Dispatch<SetStateAction<FlowWatchFilter>>;
  showWatchedByGroupsOption: boolean;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleHandler = ({ type }: { type: FlowWatchFilter }) => {
    setWatchFlowFilter(type);
    handleClose();
  };

  const options = showWatchedByGroupsOption
    ? flowFilterOptions
    : flowFilterOptions.filter((option) => option.value !== FlowWatchFilter.WatchedByMeOrMyGroups);

  return (
    <>
      <ToggleButton
        size="small"
        value={"Watched by me"}
        selected={true}
        sx={{ height: "30px", display: "flex", justifyContent: "space-between" }}
        color="primary"
        onClick={handleClick}
      >
        {flowFilterOptions.find((option) => option.value === flowWatchFilter)?.name}
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
        {options.map((option) => (
          <MenuItem key={option.value} onClick={() => toggleHandler({ type: option.value })}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

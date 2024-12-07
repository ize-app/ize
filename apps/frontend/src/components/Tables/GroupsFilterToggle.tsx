import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ToggleButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Dispatch, SetStateAction, useState } from "react";

import { GroupSummaryPartsFragment } from "@/graphql/generated/graphql";

export const GroupsFilterToggle = ({
  selectedGroupId,
  setSelectedGroupId,
  groups,
}: {
  selectedGroupId: string | undefined;
  setSelectedGroupId: Dispatch<SetStateAction<string | undefined>>;
  groups: GroupSummaryPartsFragment[];
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleHandler = ({ groupId }: { groupId: string }) => {
    if (groupId === "all") setSelectedGroupId(undefined);
    else setSelectedGroupId(groupId);
    handleClose();
  };

  const options = [
    { name: "All groups", value: "all" },
    ...groups.map((group) => ({ name: group.name, value: group.id })),
  ];

  return (
    <>
      <ToggleButton
        size="small"
        value={"Watched by me"}
        selected={!!selectedGroupId}
        sx={{ height: "30px", display: "flex", justifyContent: "space-between" }}
        color="primary"
        onClick={handleClick}
        onChange={() => {
          //   setWatchedByUser(!watchedByUser);
        }}
      >
        {options.find((option) => option.value === (selectedGroupId ?? "all"))?.name}
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
          <MenuItem key={option.value} onClick={() => toggleHandler({ groupId: option.value })}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

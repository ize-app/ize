import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { ArrayPath, FieldArray, FieldValues, UseFieldArrayReturn } from "react-hook-form";

import { ValueType } from "@/graphql/generated/graphql";

import { newInputTypes } from "../../InputField/allowedInputTypes";
import { createDefaultOptionState } from "../helpers/defaultFormState/createDefaultOptionState";

interface AddButtonProps<T extends FieldValues> {
  optionsArrayMethods: UseFieldArrayReturn<T>;
}

export const AddOptionButton = <T extends FieldValues>({
  optionsArrayMethods,
}: AddButtonProps<T>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const addOption = ({ type }: { type: ValueType }) => {
    optionsArrayMethods.append(createDefaultOptionState({ type }) as FieldArray<T, ArrayPath<T>>);
    handleClose();
  };

  return (
    <>
      <Button
        sx={{ position: "relative", alignSelf: "flex-start" }}
        variant="outlined"
        size="small"
        onClick={handleClick}
      >
        Add option
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
        {newInputTypes.map((option) => (
          <MenuItem key={option.value} onClick={() => addOption({ type: option.value })}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

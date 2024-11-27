import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { ArrayPath, FieldArray, FieldValues, UseFieldArrayReturn } from "react-hook-form";

import { FieldDataType } from "@/graphql/generated/graphql";

import { createDefaultOptionState } from "../../helpers/defaultFormState/createDefaultOptionState";

interface AddButtonProps<T extends FieldValues> {
  optionsArrayMethods: UseFieldArrayReturn<T>;
}

const optionDataTypes = [
  { name: "Text", value: FieldDataType.String },
  { name: "Number", value: FieldDataType.Number },
  { name: "Url", value: FieldDataType.Uri },
  { name: "Date Time", value: FieldDataType.DateTime },
  { name: "Date", value: FieldDataType.Date },
];

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

  const addOption = ({ dataType }: { dataType: FieldDataType }) => {
    optionsArrayMethods.append(
      createDefaultOptionState({ dataType }) as FieldArray<T, ArrayPath<T>>,
    );
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
        {optionDataTypes.map((option) => (
          <MenuItem key={option.value} onClick={() => addOption({ dataType: option.value })}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

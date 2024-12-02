import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { stringifyValueType } from "@/components/Value/stringifyValueType";
import { ValueType } from "@/graphql/generated/graphql";

import { FieldForm } from "./FieldForm";
import { fieldInputTypes } from "../../../InputField/allowedInputTypes";
import { FlowSchemaType } from "../../formValidation/flow";
import { createDefaultFieldState } from "../../helpers/defaultFormState/createDefaultFieldState";

export const triggerFieldSetPath = `fieldSet`;
export const triggerFieldsPath = `${triggerFieldSetPath}.fields`;

export interface FieldFormProps {
  fieldsArrayMethods: ReturnType<typeof useFieldArray>;
  fieldIndex: number;
  locked: boolean;
}

export const TriggerFieldsForm = () => {
  const { control, getValues } = useFormContext<FlowSchemaType, `fieldSet.fields`>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const addField = (type: ValueType) => {
    fieldsArrayMethods.append(
      createDefaultFieldState({
        type,
      }),
    );
  };

  // const { register, setValue } = formMethods;
  // ths def needs to be FlowSchemaType
  const fieldsArrayMethods = useFieldArray({
    control: control,
    name: triggerFieldsPath,
  });

  const lockedPath = `${triggerFieldSetPath}.locked`;

  const isLocked = getValues(lockedPath);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: "12px" }}>
      {fieldsArrayMethods.fields.map((item, inputIndex) => (
        <FieldForm
          key={item.id}
          //@ts-expect-error Not sure why this is throwing an error
          fieldsArrayMethods={fieldsArrayMethods}
          locked={isLocked}
          fieldIndex={inputIndex}
        />
      ))}
      {!isLocked && (
        <Box>
          <Button
            variant={"outlined"}
            size="small"
            sx={{
              flexGrow: 0,
            }}
            onClick={handleClick}
          >
            Add field
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
            {fieldInputTypes.map((type) => (
              <MenuItem key={"addTriggerField." + type.toString()} onClick={() => addField(type)}>
                {stringifyValueType(type)}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
    </Box>
  );
};

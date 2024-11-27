import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useFieldArray, useFormContext } from "react-hook-form";

import { FieldDataType, FieldType } from "@/graphql/generated/graphql";

import { FieldForm } from "./FieldForm";
import { FlowSchemaType } from "../../formValidation/flow";
import { createDefaultFieldState } from "../../helpers/defaultFormState/createDefaultFieldState";
import { defaultFreeInputDefaultOptions } from "../../helpers/defaultFreeInputDataTypeOptions";

export const triggerFieldSetPath = `fieldSet`;
export const triggerFieldsPath = `${triggerFieldSetPath}.fields`;

export interface FieldFormProps {
  fieldsArrayMethods: ReturnType<typeof useFieldArray>;
  fieldIndex: number;
  locked: boolean;
}

export const createFreeInputDataTypeOptions = (freeInputDataType: FieldDataType) => {
  if (freeInputDataType === FieldDataType.EntityIds) {
    return [{ name: "Members", value: FieldDataType.EntityIds }];
  } else if (freeInputDataType === FieldDataType.FlowIds) {
    return [{ name: "Flows", value: FieldDataType.FlowIds }];
  } else if (freeInputDataType === FieldDataType.FlowVersionId) {
    return [{ name: "Flows", value: FieldDataType.FlowVersionId }];
  } else return defaultFreeInputDefaultOptions;
};

export const TriggerFieldsForm = () => {
  const { control, getValues } = useFormContext<FlowSchemaType, `fieldSet.fields`>();
  // const { register, setValue } = formMethods;
  // ths def needs to be FlowSchemaType
  const fieldsArrayMethods = useFieldArray({
    control: control,
    name: triggerFieldsPath,
  });

  const lockedPath = `${triggerFieldSetPath}.locked`;

  const isLocked = getValues(lockedPath);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
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
            onClick={() => {
              fieldsArrayMethods.append(
                createDefaultFieldState({
                  fieldType: FieldType.FreeInput,
                }),
              );
            }}
          >
            Add field
          </Button>
        </Box>
      )}
    </Box>
  );
};

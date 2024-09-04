import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { FieldDataType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";

import { FieldOptionsForm } from "./FieldOptionsForm";
import { Select, TextField } from "../../formFields";
import { LabeledGroupedInputs } from "../../formLayout/LabeledGroupedInputs";
import { ResponsiveFormRow } from "../../formLayout/ResponsiveFormRow";
import { FlowSchemaType } from "../formValidation/flow";
import { createDefaultFieldState } from "../helpers/defaultFormState/createDefaultFieldState";

interface FieldsFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  fieldsArrayMethods: ReturnType<typeof useFieldArray>;
  formIndex: number;
  branch: "request" | "response";
}

interface FieldFormProps extends FieldsFormProps {
  inputIndex: number;
  isLocked: boolean;
}

export const createFreeInputDataTypeOptions = (freeInputDataType: FieldDataType) => {
  if (freeInputDataType === FieldDataType.EntityIds) {
    return [{ name: "Members", value: FieldDataType.EntityIds }];
  } else if (freeInputDataType === FieldDataType.FlowIds) {
    return [{ name: "Flows", value: FieldDataType.FlowIds }];
  } else if (freeInputDataType === FieldDataType.FlowVersionId) {
    return [{ name: "Flows", value: FieldDataType.FlowVersionId }];
  } else if (freeInputDataType === FieldDataType.Webhook) {
    return [{ name: "Webhook", value: FieldDataType.Webhook }];
  } else
    return [
      { name: "Text", value: FieldDataType.String },
      { name: "Number", value: FieldDataType.Number },
      { name: "Url", value: FieldDataType.Uri },
      { name: "Date Time", value: FieldDataType.DateTime },
      { name: "Date", value: FieldDataType.Date },
    ];
};

export const FieldsForm = ({
  formMethods,
  fieldsArrayMethods,
  formIndex,
  branch,
}: FieldsFormProps) => {
  const { register, setValue } = formMethods;

  const isLocked = formMethods.getValues(`steps.${formIndex}.${branch}.fieldsLocked`);

  // register values that are in zod schema but not displayed to user
  useEffect(() => {
    register(`steps.${formIndex}.${branch}.fieldsLocked`);
  }, [register, setValue]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {fieldsArrayMethods.fields.map((item, inputIndex) => (
        <FieldForm
          key={item.id}
          formMethods={formMethods}
          formIndex={formIndex}
          fieldsArrayMethods={fieldsArrayMethods}
          branch={branch}
          isLocked={isLocked}
          inputIndex={inputIndex}
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

export const FieldForm = ({
  formMethods,
  fieldsArrayMethods,
  formIndex,
  branch,
  inputIndex,
  isLocked,
}: FieldFormProps) => {
  const { control, register, setValue } = formMethods;

  const fieldType: FieldType = formMethods.watch(
    `steps.${formIndex}.${branch}.fields.${inputIndex}.type`,
  );

  const [displayForm, setDisplayForm] = useState<boolean>(true);
  const [prevFieldType, setPrevFieldType] = useState<FieldType | undefined>(fieldType);

  // register values that are in zod schema but not displayed to user
  useEffect(() => {
    register(`steps.${formIndex}.${branch}.fields.${inputIndex}.type`);
    setValue(`steps.${formIndex}.${branch}.fields.${inputIndex}.type`, fieldType);

    if (prevFieldType && fieldType && fieldType !== prevFieldType) {
      formMethods.setValue(
        `steps.${formIndex}.${branch}.fields.${inputIndex}`,
        createDefaultFieldState({ fieldType }),
      );
      setDisplayForm(true);
    }
    setPrevFieldType(fieldType);
  }, [register, fieldType]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "space-between",
      }}
    >
      <LabeledGroupedInputs>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "12px",
            width: "100%",
            backgroundColor: "#fffff5",
          }}
        >
          <Select<FlowSchemaType>
            control={control}
            size={"small"}
            name={`steps.${formIndex}.${branch}.fields.${inputIndex}.type`}
            key={"type" + inputIndex.toString() + formIndex.toString()}
            onChange={() => setDisplayForm(false)}
            selectOptions={[
              { name: "Free input", value: FieldType.FreeInput },
              { name: "Options", value: FieldType.Options },
            ]}
            label="Type"
            // defaultValue={fieldType}
            disabled={isLocked}
          />
          <TextField<FlowSchemaType>
            name={`steps.${formIndex}.${branch}.fields.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            multiline
            placeholderText={`What's your question?`}
            label={``}
            defaultValue=""
            disabled={isLocked}
          />
          {fieldType === FieldType.FreeInput && displayForm && (
            <FreeInputFieldForm
              formMethods={formMethods}
              formIndex={formIndex}
              fieldsArrayMethods={fieldsArrayMethods}
              branch={branch}
              isLocked={isLocked}
              inputIndex={inputIndex}
            />
          )}
          {fieldType === FieldType.Options && displayForm && (
            <OptionFieldForm
              formMethods={formMethods}
              formIndex={formIndex}
              fieldsArrayMethods={fieldsArrayMethods}
              branch={branch}
              isLocked={isLocked}
              inputIndex={inputIndex}
            />
          )}
        </Box>
      </LabeledGroupedInputs>
      {isLocked ? null : (
        <IconButton
          color="primary"
          size="small"
          aria-label="Remove input option"
          onClick={() => fieldsArrayMethods.remove(inputIndex)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export const OptionFieldForm = ({
  formMethods,
  formIndex,
  branch,
  inputIndex,
  isLocked,
}: FieldFormProps) => {
  const { control } = formMethods;

  // if (!selectionType) return null;

  return (
    <>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          control={control}
          disabled={isLocked}
          name={`steps.${formIndex}.${branch}.fields.${inputIndex}.optionsConfig.selectionType`}
          size="small"
          selectOptions={[
            {
              name: "Select one option",
              value: FieldOptionsSelectionType.Select,
            },
            {
              name: "Select multiple options",
              value: FieldOptionsSelectionType.MultiSelect,
            },
            {
              name: "Rank options",
              value: FieldOptionsSelectionType.Rank,
            },
          ]}
          // defaultValue={FieldOptionsSelectionType.Select}
          label="How do participants select options?"
        />
      </ResponsiveFormRow>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <FieldOptionsForm
            locked={isLocked}
            formMethods={formMethods}
            formIndex={formIndex}
            fieldIndex={inputIndex}
            branch={branch}
          />
        </Box>
      </Box>
    </>
  );
};

export const FreeInputFieldForm = ({
  formMethods,
  formIndex,
  branch,
  inputIndex,
  isLocked,
}: FieldFormProps) => {
  const { control, register } = formMethods;

  // register values that are in zod schema but not displayed to user
  useEffect(() => {}, [register]);

  const freeInputDataType = formMethods.getValues(
    `steps.${formIndex}.${branch}.fields.${inputIndex}.freeInputDataType`,
  );

  return (
    <>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          control={control}
          // sx={{
          //   display: fieldType === FieldType.FreeInput ? "flex" : "none",
          // }}
          size={"small"}
          disabled={isLocked}
          name={`steps.${formIndex}.${branch}.fields.${inputIndex}.freeInputDataType`}
          key={"dataType" + inputIndex.toString() + formIndex.toString()}
          selectOptions={createFreeInputDataTypeOptions(freeInputDataType)}
          label="Free input data type"
          defaultValue=""
        />
      </ResponsiveFormRow>
    </>
  );
};

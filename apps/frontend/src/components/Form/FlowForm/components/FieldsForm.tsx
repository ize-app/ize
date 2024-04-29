import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FlowSchemaType } from "../formValidation/flow";

import { Select, TextField } from "../../formFields";
import { LabeledGroupedInputs } from "../../formLayout/LabeledGroupedInputs";

import { FieldDataType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";
import { Box } from "@mui/material";
import { FieldOptionsForm } from "./FieldOptionsForm";
import { FieldSchemaType } from "../formValidation/fields";
import { ResponsiveFormRow } from "../../formLayout/ResponsiveFormRow";

interface FieldsFormProps {
  useFormMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number;
  branch: "request" | "response";
}

export const defaultField = (stepIndex: number, fieldIndex: number): FieldSchemaType => ({
  fieldId: "new." + stepIndex + "." + fieldIndex,
  type: FieldType.FreeInput,
  name: "",
  required: true,
  freeInputDataType: FieldDataType.String,
});

export const FieldsForm = ({ useFormMethods, formIndex, branch }: FieldsFormProps) => {
  const { control } = useFormMethods;

  const fieldsArrayMethods = useFieldArray({
    control: useFormMethods.control,
    name: `steps.${formIndex}.${branch}.fields`,
  });

  const numFields = (useFormMethods.watch(`steps.${formIndex}.${branch}.fields`) ?? []).length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {fieldsArrayMethods.fields.map((item, inputIndex) => {
        const noEdit = false; //item.name === "Request title" ? true : false;

        const fieldType: FieldType = useFormMethods.watch(
          `steps.${formIndex}.${branch}.fields.${inputIndex}.type`,
        );

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
            <LabeledGroupedInputs key={item.id}>
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
                <Box sx={{ display: "none" }}>
                  <TextField<FlowSchemaType>
                    name={`steps.${formIndex}.${branch}.fields.${inputIndex}.fieldId`}
                    key={"fieldId" + inputIndex.toString() + formIndex.toString()}
                    control={control}
                    label="fieldId"
                    disabled={true}
                  />
                </Box>
                <TextField<FlowSchemaType>
                  name={`steps.${formIndex}.${branch}.fields.${inputIndex}.name`}
                  key={"name" + inputIndex.toString() + formIndex.toString()}
                  control={control}
                  multiline
                  placeholderText={`What's your question?`}
                  label={``}
                />
                <ResponsiveFormRow>
                  <Select<FlowSchemaType>
                    control={control}
                    displayLabel={false}
                    size={"small"}
                    disabled={noEdit}
                    name={`steps.${formIndex}.${branch}.fields.${inputIndex}.type`}
                    key={"type" + inputIndex.toString() + formIndex.toString()}
                    selectOptions={[
                      { name: "Free input", value: FieldType.FreeInput },
                      { name: "Options", value: FieldType.Options },
                    ]}
                    label="Type"
                  />
                  {fieldType === FieldType.FreeInput ? (
                    <Select<FlowSchemaType>
                      control={control}
                      displayLabel={false}
                      size={"small"}
                      disabled={noEdit}
                      name={`steps.${formIndex}.${branch}.fields.${inputIndex}.freeInputDataType`}
                      key={"dataType" + inputIndex.toString() + formIndex.toString()}
                      selectOptions={[
                        { name: "Text", value: FieldDataType.String },
                        { name: "Number", value: FieldDataType.Number },
                        { name: "Url", value: FieldDataType.Uri },
                        { name: "Date Time", value: FieldDataType.DateTime },
                        { name: "Date", value: FieldDataType.Date },
                      ]}
                      label="Free input data type"
                    />
                  ) : (
                    <Select<FlowSchemaType>
                      control={control}
                      name={`steps.${formIndex}.${branch}.fields.${inputIndex}.optionsConfig.selectionType`}
                      displayLabel={false}
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
                      label="How do participants select options?"
                    />
                  )}
                </ResponsiveFormRow>
                {fieldType === FieldType.Options && (
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
                        formMethods={useFormMethods}
                        formIndex={formIndex}
                        fieldIndex={inputIndex}
                        branch={branch}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </LabeledGroupedInputs>
            {noEdit ? null : (
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
      })}
      <Box>
        <Button
          variant={"outlined"}
          size="small"
          sx={{
            flexGrow: 0,
          }}
          onClick={() => {
            fieldsArrayMethods.append(defaultField(formIndex, numFields));
          }}
        >
          Add field
        </Button>
      </Box>
    </Box>
  );
};

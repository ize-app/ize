import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FlowSchemaType } from "../formValidation/flow";

import { Checkbox, Select, TextField } from "../../FormFields";
import { LabeledGroupedInputs } from "../../LabeledGroupedInputs";

import { FieldDataType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";
import { Box } from "@mui/material";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { FieldOptionsForm } from "./FieldOptionsForm";
import { FieldSchemaType } from "../formValidation/fields";

interface FieldsFormProps {
  useFormMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number;
  branch: "request" | "response";
}

export const defaultField = (fieldIndex: number): FieldSchemaType => ({
  fieldId: "new." + fieldIndex,
  type: FieldType.FreeInput,
  name: "",
  required: true,
  freeInputDataType: FieldDataType.String,
});

export const FieldsForm = ({ useFormMethods, formIndex, branch }: FieldsFormProps) => {
  const { control } = useFormMethods;

  const fieldsArrayMethods = useFieldArray({
    control: useFormMethods.control,
    //@ts-ignore
    name: `steps.${formIndex}.${branch}.fields`,
  });

  //@ts-ignore
  const numFields = (useFormMethods.watch(`steps.${formIndex}.${branch}.fields`) ?? []).length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {fieldsArrayMethods.fields.map((item, inputIndex) => {
        const noEdit = false; //item.name === "Request title" ? true : false;

        //@ts-ignore
        const fieldType: FieldType = useFormMethods.watch(
          //@ts-ignore
          `steps.${formIndex}.${branch}.fields.${inputIndex}.type`,
        );

        return (
          <LabeledGroupedInputs label={"Fields " + (inputIndex + 1).toString()} key={item.id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "space-between",
                backgroundColor: "#FBF5FD",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  padding: "12px",
                  width: "100%",
                }}
              >
                <ResponsiveFormRow>
                  <Box sx={{ display: "none" }}>
                    <TextField<FlowSchemaType>
                      //@ts-ignore
                      name={`steps.${formIndex}.${branch}.fields.${inputIndex}.fieldId`}
                      key={"fieldId" + inputIndex.toString() + formIndex.toString()}
                      control={control}
                      label="outlined"
                      disabled={true}
                      variant="outlined"
                    />
                  </Box>
                  <TextField<FlowSchemaType>
                    //@ts-ignore
                    name={`steps.${formIndex}.${branch}.fields.${inputIndex}.name`}
                    key={"name" + inputIndex.toString() + formIndex.toString()}
                    control={control}
                    width="200px"
                    flexGrow="1"
                    placeholderText={`What's your question?`}
                    label={``}
                  />
                  <Select<FlowSchemaType>
                    control={control}
                    width="110px"
                    displayLabel={false}
                    size={"small"}
                    disabled={noEdit}
                    //@ts-ignore
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
                      width="160px"
                      displayLabel={false}
                      size={"small"}
                      disabled={noEdit}
                      //@ts-ignore
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
                    <Select
                      control={control}
                      width="160px"
                      //@ts-ignore
                      name={`steps.${formIndex}.${branch}.fields.${inputIndex}.optionsConfig.selectionType`}
                      selectOptions={[
                        {
                          name: "Select one option",
                          value: FieldOptionsSelectionType.Select,
                        },
                        //   {
                        //     name: "Rank options",
                        //     value: FieldOptionsSelectionType.Rank,
                        //   },
                      ]}
                      label="How do participants select options?"
                    />
                  )}
                </ResponsiveFormRow>
                {fieldType === FieldType.Options && (
                  <ResponsiveFormRow>
                    <FieldOptionsForm
                      formMethods={useFormMethods}
                      formIndex={formIndex}
                      fieldIndex={inputIndex}
                      branch={branch}
                    />
                  </ResponsiveFormRow>
                )}
              </Box>
              {noEdit ? null : (
                <Box>
                  <IconButton
                    color="primary"
                    aria-label="Remove input option"
                    onClick={() => fieldsArrayMethods.remove(inputIndex)}
                  >
                    <HighlightOffOutlined />
                  </IconButton>
                </Box>
              )}
            </Box>
          </LabeledGroupedInputs>
        );
      })}
      <Button
        variant={"outlined"}
        sx={{ width: "140px" }}
        onClick={() => {
          fieldsArrayMethods.append(defaultField(numFields));
        }}
      >
        Add field
      </Button>
    </Box>
  );
};

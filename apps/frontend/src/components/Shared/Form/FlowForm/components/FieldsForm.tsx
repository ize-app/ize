import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
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
  fieldsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
  formIndex: number;
  branch: "request" | "response";
}

export const defaultField: FieldSchemaType = {
  fieldId: "",
  type: FieldType.FreeInput,
  name: "",
  required: true,
  freeInputDataType: FieldDataType.String,
};

export const FieldsForm = ({
  useFormMethods,
  formIndex,
  fieldsArrayMethods,
  branch,
}: FieldsFormProps) => {
  const { control } = useFormMethods;

  const { fields, remove, append } = fieldsArrayMethods;

  return (
    <LabeledGroupedInputs label="Fields">
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          padding: "16px",
        }}
      >
        <TableContainer
          sx={{
            overflowX: "auto",
            paddingBottom: "20px",
            "& .MuiTableCell-root": {
              padding: "4px",
              border: "none",
            },
          }}
        >
          <Table aria-label="Fields" stickyHeader={true}>
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell>Type</TableCell>
                <TableCell></TableCell>
                <TableCell align="center">Required?</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((item, inputIndex) => {
                const noEdit = false; //item.name === "Request title" ? true : false;

                //@ts-ignore
                const fieldType: FieldType = useFormMethods.watch(
                  //@ts-ignore
                  `steps.${formIndex}.${branch}.fields.${inputIndex}.type`,
                );

                return (
                  <>
                    <TableRow key={item.id}>
                      <TableCell sx={{ display: "none" }}>
                        <TextField<FlowSchemaType>
                          //@ts-ignore
                          name={`steps.${formIndex}.${branch}.fields.${inputIndex}.fieldId`}
                          key={"fieldId" + inputIndex.toString() + formIndex.toString()}
                          control={control}
                          label="outlined"
                          disabled={true}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: "200px" }}>
                        <TextField<FlowSchemaType>
                          //@ts-ignore
                          name={`steps.${formIndex}.${branch}.fields.${inputIndex}.name`}
                          key={"name" + inputIndex.toString() + formIndex.toString()}
                          control={control}
                          placeholderText={`What's your question?`}
                          label={``}
                        />
                      </TableCell>
                      <TableCell width="120px">
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
                      </TableCell>
                      <TableCell
                        //   align="center"
                        sx={{
                          width: "110px",
                        }}
                      >
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
                              {
                                name: "Rank options",
                                value: FieldOptionsSelectionType.Rank,
                              },
                            ]}
                            label="How do participants select options?"
                          />
                        )}
                      </TableCell>
                      <TableCell align="center" sx={{ width: "100px" }}>
                        <Checkbox<FlowSchemaType>
                          //@ts-ignore
                          name={`steps.${formIndex}.${branch}.fields.${inputIndex}.required`}
                          key={"required" + inputIndex.toString() + formIndex.toString()}
                          disabled={noEdit}
                          control={control}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "100px" }}>
                        {noEdit ? null : (
                          <IconButton
                            color="primary"
                            aria-label="Remove input option"
                            onClick={() => remove(inputIndex)}
                          >
                            <HighlightOffOutlined />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                    {fieldType === FieldType.Options && (
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                          <ResponsiveFormRow>
                            <FieldOptionsForm
                              formMethods={useFormMethods}
                              formIndex={formIndex}
                              fieldIndex={inputIndex}
                              branch={branch}
                            />
                          </ResponsiveFormRow>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          sx={{ margin: "0px 0px 8px 8px", position: "relative", bottom: "8px" }}
          variant="outlined"
          onClick={() => {
            append(defaultField);
          }}
        >
          Add field
        </Button>
      </Box>
    </LabeledGroupedInputs>
  );
};

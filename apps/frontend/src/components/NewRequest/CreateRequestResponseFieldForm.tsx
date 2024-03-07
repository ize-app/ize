import { Field, FieldType } from "@/graphql/generated/graphql";
import { LabeledGroupedInputs } from "../shared/Form/LabeledGroupedInputs";
import Typography from "@mui/material/Typography";

import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { TextField, DatePicker, DateTimePicker } from "../shared/Form/FormFields";

import { FieldDataType } from "@/graphql/generated/graphql";
import Box from "@mui/material/Box";

import { RequestDefinedOptionSchemaType, RequestSchemaType } from "./validation";

export const CreateRequestResponseFieldForm = ({
  field,
  formMethods,
}: {
  field: Field | undefined;
  formMethods: UseFormReturn<RequestSchemaType>;
}) => {
  if (!field) return null;
  switch (field.__typename) {
    case FieldType.FreeInput: {
      return (
        <Typography fontWeight={500}>{field.name + " (" + field.dataType + " input)"}</Typography>
      );
    }
    case FieldType.Options: {
      const requestDefinedOptionsFormMethods = useFieldArray({
        control: formMethods.control,
        name: `requestDefinedOptions`,
      });

      const renderInput = (dataType: FieldDataType, index: number) => {
        switch (dataType) {
          case FieldDataType.Date:
            return (
              <DatePicker<RequestSchemaType>
                name={`requestDefinedOptions.${index}.name`}
                key={"option" + index.toString()}
                control={formMethods.control}
                showLabel={false}
                label={`Option #${index + 1}`}
              />
            );
          case FieldDataType.DateTime:
            return (
              <DateTimePicker<RequestSchemaType>
                name={`requestDefinedOptions.${index}.name`}
                key={"option" + index.toString()}
                control={formMethods.control}
                showLabel={false}
                label={`Option #${index + 1}`}
              />
            );
          default:
            return (
              <TextField<RequestSchemaType>
                name={`requestDefinedOptions.${index}.name`}
                key={"option" + index.toString()}
                control={formMethods.control}
                showLabel={false}
                label={`Option #${index + 1}`}
                size="small"
                variant="standard"
              />
            );
        }
      };
      const defaultOption: RequestDefinedOptionSchemaType = {
        dataType: field.requestOptionsDataType as FieldDataType,
        name: "",
      };
      return (
        <LabeledGroupedInputs label="">
          <Box sx={{ display: "flex", flexDirection: "column", padding: "16px" }}>
            <Typography fontWeight={500}>{field.name}</Typography>
            {
              <TableContainer
                sx={{
                  overflowX: "auto",
                  maxWidth: "1000px",
                  padding: "0px",
                  "& .MuiTableCell-root": {
                    padding: "0px",
                    border: "none",
                  },
                }}
              >
                <Table aria-label="Response options table" stickyHeader={true}>
                  <TableBody>
                    {/* Existing options defined on the workflow */}
                    {field.options.map((option) => {
                      return (
                        <TableRow key={option.optionId}>
                          {/* Need to add a hidden option ID text field so that default values propogate correctly */}
                          <TableCell
                            align="center"
                            sx={{
                              display: "none",
                            }}
                          ></TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell sx={{ minWidth: "150px" }}>
                            <Typography>{option.name}</Typography>
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      );
                    })}
                    {requestDefinedOptionsFormMethods.fields.map((item, inputIndex) => {
                      return (
                        <TableRow key={inputIndex}>
                          {/* Need to add a hidden option ID text field so that default values propogate correctly */}
                          <TableCell
                            align="center"
                            sx={{
                              display: "none",
                            }}
                          >
                            <TextField<RequestSchemaType>
                              name={`requestDefinedOptions.${inputIndex}.dataType`}
                              key={"dataType" + inputIndex.toString()}
                              control={formMethods.control}
                              showLabel={false}
                              label={`Option ID - ignore`}
                              variant="standard"
                              disabled={true}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">-</TableCell>
                          <TableCell sx={{ minWidth: "150px" }}>
                            {renderInput(item.dataType, inputIndex)}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="primary"
                              aria-label="Remove option"
                              onClick={() => requestDefinedOptionsFormMethods.remove(inputIndex)}
                            >
                              <HighlightOffOutlined />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* Request defined options (if applicable)*/}
                  </TableBody>
                </Table>
              </TableContainer>
            }
          </Box>
          {field.hasRequestOptions && (
            <Button
              sx={{ margin: "0px 0px 8px 16px", position: "relative", bottom: "8px" }}
              variant="outlined"
              onClick={() => {
                requestDefinedOptionsFormMethods.append(defaultOption);
              }}
            >
              Add option
            </Button>
          )}
        </LabeledGroupedInputs>
      );
    }
  }
};

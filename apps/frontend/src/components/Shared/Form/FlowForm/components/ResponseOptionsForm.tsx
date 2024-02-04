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
import * as z from "zod";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { RequestInputDataType, ResponseDataType } from "../types";
import { Checkbox, Select, TextField } from "../../FormFields";
import { LabeledGroupedInputs } from "./LabeledGroupedInputs";

import { responseOptionSchema } from "../formSchema";

type ResponseOptionType = z.infer<typeof responseOptionSchema>;

interface RequestInputsFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
  responseOptionsFormMethods: UseFieldArrayReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
}

export const ResponseOptionsForm = ({
  useFormMethods,
  formIndex,
  responseOptionsFormMethods,
}: RequestInputsFormProps) => {
  const { control } = useFormMethods;
  const { fields, remove, append } = responseOptionsFormMethods;

  return (
    <LabeledGroupedInputs label="Options">
      <TableContainer
        sx={{
          overflowX: "auto",
          maxWidth: "1000px",
          padding: "20px 16px 16px",
          "& .MuiTableCell-root": {
            padding: "4px",
            border: "none",
          },
        }}
      >
        <Table aria-label="Response options table" stickyHeader={true}>
          <TableBody>
            {fields.map((item, inputIndex) => {
              const cannotDelete = inputIndex < 2;

              return (
                <TableRow key={item.id}>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField<NewFlowFormFields>
                      name={`steps.${formIndex}.respond.inputs.options.options.${inputIndex}.name`}
                      key={item.id}
                      control={control}
                      placeholderText={`Option #${inputIndex + 1}`}
                      showLabel={false}
                      label={`Option #${inputIndex + 1}`}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {cannotDelete ? null : (
                      <IconButton
                        color="primary"
                        aria-label="Remove option"
                        onClick={() => remove(inputIndex)}
                      >
                        <HighlightOffOutlined />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        sx={{ margin: "0px 0px 8px 16px", position: "relative", bottom: "8px" }}
        variant="outlined"
        onClick={() => {
          append({
            name: "",
          } as ResponseOptionType);
        }}
      >
        Add input
      </Button>
    </LabeledGroupedInputs>
  );
};

import { zodResolver } from "@hookform/resolvers/zod";
import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { useNewProcessWizardState } from "../../../../NewProcess/newProcessWizard";
import {
  InputDataType,
  InputTemplateArgs,
} from "../../../../../graphql/generated/graphql";
import { CheckboxControl, SelectControl, TextFieldControl } from "../..";
import { WizardBody, WizardNav } from "../../../Wizard";

const fieldArrayName = "processInputs";

const rowSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim(),
  required: z.boolean(),
  type: z.nativeEnum(InputDataType),
});

const formSchema = z.object({ [fieldArrayName]: z.array(rowSchema) });

interface FormFields {
  processInputs: InputTemplateArgs[];
}

export const TemplateInputs = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } =
    useNewProcessWizardState();

  const { inputs } = formState;

  const intitialFormState = inputs ? [...inputs] : [];
  if (intitialFormState.length === 0)
    intitialFormState.push({
      name: "Request title",
      description: "Brief summary of request",
      required: true,
      type: InputDataType.Text,
    });

  const { control, handleSubmit } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [fieldArrayName]: intitialFormState,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrayName,
  });

  const onSubmit = (data: FormFields) => {
    setFormState((prev) => ({
      ...prev,
      inputs: [...data.processInputs],
    }));
    onNext();
  };

  return (
    <>
      <WizardBody>
        <Typography variant="body1">
          This process is triggered by creating a{" "}
          <span style={{ fontWeight: "bold" }}>request</span>. You can define
          whether this process needs certain information to be triggered via{" "}
          <span style={{ fontWeight: "bold" }}>input fields</span>. Input fields
          help keep proposals consistent and make it easier to build
          integrations with other tools. <br />
          <br />
          For example, a “Reimburse expense” process might have a required
          “Amount” field on each proposal. <br />
        </Typography>
        <form>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table aria-label="input table" stickyHeader={true}>
              <TableHead>
                <TableRow>
                  <TableCell>Input name</TableCell>
                  <TableCell align="center">Input type</TableCell>
                  <TableCell align="center">Required?</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((item, index) => {
                  const name = `${fieldArrayName}[${index}]`;
                  const noEdit = item.name === "Request title" ? true : false;
                  return (
                    <TableRow key={item.id}>
                      <TableCell sx={{ minWidth: "150px" }}>
                        <TextFieldControl
                          name={`${name}.name`}
                          key={"name" + index.toString()}
                          fullWidth
                          disabled={noEdit}
                          //@ts-ignore
                          control={control}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "120px" }}>
                        <SelectControl
                          name={`${name}.type`}
                          selectOptions={[
                            { name: "Number", value: InputDataType.Float },
                            { name: "Text", value: InputDataType.Text },
                          ]}
                          key={"type" + index.toString()}
                          sx={{ width: "120px" }}
                          disabled={noEdit}
                          //@ts-ignore
                          control={control}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <CheckboxControl
                          name={`${name}.required`}
                          key={"required" + index.toString()}
                          disabled={noEdit}
                          //@ts-ignore
                          control={control}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: "200px" }}>
                        <TextFieldControl
                          name={`${name}.description`}
                          key={"description" + index.toString()}
                          fullWidth
                          disabled={noEdit}
                          //@ts-ignore
                          control={control}
                        />
                      </TableCell>
                      <TableCell>
                        {noEdit ? null : (
                          <IconButton
                            color="primary"
                            aria-label="Remove input option"
                            onClick={() => remove(index)}
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
            sx={{ marginTop: "16px", marginLeft: "16px" }}
            variant="outlined"
            onClick={() => {
              append({
                name: "",
                description: "",
                required: true,
                type: InputDataType.Text,
              });
            }}
          >
            Add input
          </Button>
        </form>
      </WizardBody>
      <WizardNav
        onNext={handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { ProcessOptions } from "@/components/shared/Process/ProcessOptions";
import {
  FormOptionChoice,
  ProcessDecision,
  ProcessForm,
} from "@/components/shared/Form/ProcessForm/types";
import { InputTemplate, ProcessOption } from "@/graphql/generated/graphql";
import SummarizeInputTemplates from "@/components/shared/Process/SummarizeInputTemplates";
import { ReactNode } from "react";
import SummarizeAction from "@/components/shared/Process/SummarizeAction";
import { AvatarsCell } from "@/components/shared/Tables/TableCells";
import { AvatarProps } from "@/components/shared/Avatar";
import { summarizeDecisionSystemForm } from "@/components/shared/Process/summarizeDecisionSystem";
import { createOptionInputs } from "../createProcessMutation";

enum ProcessFormDisplayFields {
  Name = "Name",
  Description = "Description",
  Options = "Options",
  Inputs = "Inputs",
  Action = "Custom Integration",
  Request = "Request",
  Respond = "Respond",
  Decision = "Decision",
  RequestEvolve = "Request to evolve process",
  RespondEvolve = "Respond on whether to evolve process",
  DecisionEvolve = "Decide on evolving process",
}

const displayProcessFormField = (
  field: ProcessFormDisplayFields,
  form: ProcessForm,
  fontSize: "body1" | "body2",
): ReactNode => {
  switch (field) {
    case ProcessFormDisplayFields.Name:
      return <Typography variant={fontSize}>{form.name}</Typography>;
    case ProcessFormDisplayFields.Description:
      return <Typography variant={fontSize}>{form.description}</Typography>;
    case ProcessFormDisplayFields.Inputs:
      return (
        <SummarizeInputTemplates
          variant={fontSize}
          inputs={form.inputs as InputTemplate[]}
        />
      );
    case ProcessFormDisplayFields.Options:
      return (
        <ProcessOptions
          options={createOptionInputs(
            form.options as FormOptionChoice,
            form.customOptions ?? [],
          ).map((option, index) => ({ ...option, id: index.toString() }))}
        />
      );
    case ProcessFormDisplayFields.Action:
      return form.action?.webhook ? (
        <SummarizeAction
          uri={form.action.webhook.uri as string}
          optionTrigger={form.action.optionTrigger ?? undefined}
        />
      ) : (
        <Typography>No custom integration</Typography>
      );
    case ProcessFormDisplayFields.Request:
      return (
        <AvatarsCell
          avatars={form?.rights?.request as AvatarProps[]}
          align="left"
        />
      );
    case ProcessFormDisplayFields.Respond:
      return (
        <AvatarsCell
          avatars={form?.rights?.response as AvatarProps[]}
          align="left"
        />
      );
    case ProcessFormDisplayFields.Decision:
      return (
        <Typography variant={fontSize}>
          {summarizeDecisionSystemForm(form?.decision as ProcessDecision)}
        </Typography>
      );
    case ProcessFormDisplayFields.RequestEvolve:
      return (
        <AvatarsCell
          avatars={form?.evolve?.rights?.request as AvatarProps[]}
          align="left"
        />
      );
    case ProcessFormDisplayFields.RespondEvolve:
      return (
        <AvatarsCell
          avatars={form?.evolve?.rights?.response as AvatarProps[]}
          align="left"
        />
      );
    case ProcessFormDisplayFields.DecisionEvolve:
      return (
        <Typography variant={fontSize}>
          {summarizeDecisionSystemForm(
            form?.evolve?.decision as ProcessDecision,
          )}
        </Typography>
      );
    default:
      null;
  }
};

export const ProcessFormConfirmationTable = ({
  process,
  evolvedProcess,
  fields = Object.values(ProcessFormDisplayFields),
  rowSize = "small",
}: {
  process: ProcessForm;
  evolvedProcess?: ProcessForm;
  fields?: ProcessFormDisplayFields[];
  rowSize?: "small" | "medium";
}) => {
  const fontSize = rowSize === "medium" ? "body1" : "body2";

  return (
    <TableContainer
      sx={{
        overflowX: "initial",
        // [`& :last-of-type.${tableRowClasses.root}`]: {
        //   [`& .${tableCellClasses.root}`]: {
        //     borderBottom: "none",
        //   },
        // },
        [`& ${tableRowClasses.root}`]: {
          [`& .${tableCellClasses.root}`]: {
            border: "none",
          },
        },
      }}
    >
      <Table aria-label="collapsible table" size={rowSize}>
        <TableBody>
          {fields.map((field) => (
            <TableRow sx={{ minHeight: "100px" }}>
              <TableCell>
                <Typography fontWeight={500} variant={fontSize}>
                  {field}
                </Typography>
              </TableCell>
              <TableCell>
                {displayProcessFormField(field, process, fontSize)}
              </TableCell>
              {evolvedProcess && (
                <>
                  <TableCell width={"40px"}>
                    <ArrowForwardIcon />
                  </TableCell>
                  <TableCell>
                    <Typography variant={fontSize}>
                      {displayProcessFormField(field, evolvedProcess, fontSize)}
                    </Typography>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

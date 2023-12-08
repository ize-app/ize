import { Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

import { createOptionInputs } from "../createProcessMutation";

import { AvatarGroup, AvatarProps } from "@/components/shared/Avatar";
import {
  FormOptionChoice,
  HasCustomIntegration,
  ProcessDecision,
  ProcessForm,
} from "@/components/shared/Form/ProcessForm/types";
import { ProcessOptions } from "@/components/shared/Process/ProcessOptions";
import SummarizeAction from "@/components/shared/Process/SummarizeAction";
import { summarizeDecisionSystemForm } from "@/components/shared/Process/summarizeDecisionSystem";
import SummarizeInputTemplates from "@/components/shared/Process/SummarizeInputTemplates";
import { InputTemplate } from "@/graphql/generated/graphql";
import { intervalToIntuitiveTimeString } from "@/utils/inputs";

export enum ProcessFormDisplayFields {
  Name = "Name",
  Description = "Description",
  Options = "Options",
  Inputs = "Inputs",
  Action = "Custom Integration",
  Request = "Request",
  Respond = "Respond",
  Decision = "Decision",
  RequestExpiration = "Request expiration",
  EvolveRequestExpiration = "Evolve request expiration",
  EvolveRequest = "Request to evolve process",
  EvolveRespond = "Respond on whether to evolve process",
  EvolveDecision = "Decide on evolving process",
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
      return <SummarizeInputTemplates variant={fontSize} inputs={form.inputs as InputTemplate[]} />;
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
      return form.action?.webhook.hasWebhook === HasCustomIntegration.Yes ? (
        <SummarizeAction
          uri={form.action.webhook.uri as string}
          optionTrigger={form.action.optionTrigger ?? undefined}
          fontSize={fontSize}
        />
      ) : (
        <Typography variant={fontSize}>No custom integration</Typography>
      );
    case ProcessFormDisplayFields.Request:
      return (
        <Box sx={{ display: "flex", flexDirection: "flex-start" }}>
          <AvatarGroup agents={form?.rights?.request as AvatarProps[]} />
        </Box>
      );
    case ProcessFormDisplayFields.Respond:
      return (
        <Box sx={{ display: "flex", flexDirection: "flex-start" }}>
          <AvatarGroup agents={form?.rights?.response as AvatarProps[]} />
        </Box>
      );
    case ProcessFormDisplayFields.Decision:
      return (
        <Typography variant={fontSize}>
          {summarizeDecisionSystemForm(form?.decision as ProcessDecision)}
        </Typography>
      );
    case ProcessFormDisplayFields.EvolveRequest:
      return (
        <Box sx={{ display: "flex", flexDirection: "flex-start" }}>
          <AvatarGroup agents={form?.evolve?.rights?.request as AvatarProps[]} />
        </Box>
      );
    case ProcessFormDisplayFields.EvolveRespond:
      return (
        <Box sx={{ display: "flex", flexDirection: "flex-start" }}>
          <AvatarGroup agents={form?.evolve?.rights?.response as AvatarProps[]} />
        </Box>
      );
    case ProcessFormDisplayFields.EvolveDecision:
      return (
        <Typography variant={fontSize}>
          {summarizeDecisionSystemForm(form?.evolve?.decision as ProcessDecision)}
        </Typography>
      );
    case ProcessFormDisplayFields.RequestExpiration:
      return (
        <Typography>
          {intervalToIntuitiveTimeString(
            (form.decision?.requestExpirationSeconds as number) * 1000,
          )}
        </Typography>
      );
    case ProcessFormDisplayFields.EvolveRequestExpiration:
      return (
        <Typography>
          {intervalToIntuitiveTimeString(
            (form.evolve?.decision?.requestExpirationSeconds as number) * 1000,
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
        marginBottom: "16px",
        overflowX: "initial",
        [`& :last-of-type.${tableRowClasses.root}`]: {
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
        },
      }}
    >
      <Table aria-label="collapsible table" size={rowSize}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="left">Current</TableCell>
            <TableCell align="left">Proposed evolution</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field[0] + index.toString()}>
              <TableCell
                sx={(_theme) => ({
                  // [theme.breakpoints.up("sm")]: {
                  //   minWidth: "300px",
                  // },
                  width: "150px",
                })}
              >
                <Typography fontWeight={500} variant={fontSize}>
                  {field}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: evolvedProcess ? "40%" : "100%" }}>
                {displayProcessFormField(field, process, fontSize)}
              </TableCell>
              {evolvedProcess && (
                <>
                  <TableCell sx={{ width: "40%" }}>
                    {displayProcessFormField(field, evolvedProcess, fontSize)}
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

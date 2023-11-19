import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import {
  InputTemplateArgs,
  ProcessOption,
} from "../../../graphql/generated/graphql";
import {
  ActionForm,
  ProcessDecision,
} from "@/components/shared/Form/ProcessForm/types";
import { AvatarProps } from "../../shared/Avatar";
import { ProcessOptions } from "../Process/ProcessOptions";
import SummarizeAction from "../Process/SummarizeAction";
import { summarizeDecisionSystemForm } from "../Process/summarizeDecisionSystem";
import SummarizeInputTemplates from "../Process/SummarizeInputTemplates";
import { AvatarsCell } from "../Tables/TableCells";

// diff function
// do a diff and see what top level categories are different
// create array of those fields or you can pass in null 

// pass to function that displays all elements of array you selected, default all (type of keys of ?)

// iterates through array and displays field
// create object with display transformer for all fields


// create row / table for this


// pass in old and new normal process state

export interface ProcessSnapshotForDiff {
  name?: string;
  description?: string;
  action?: ActionForm;
  options?: ProcessOption[];
  request?: AvatarProps[];
  respond?: AvatarProps[];
  edit?: AvatarProps;
  decision?: ProcessDecision;
  inputs?: InputTemplateArgs[];
}

export const EditProcessRequestInputTable = ({
  oldProcess,
  proposedChanges,
  rowSize,
}: {
  oldProcess: ProcessSnapshotForDiff;
  proposedChanges?: ProcessSnapshotForDiff;
  rowSize?: "small" | "medium";
}) => {
  const fontSize = rowSize === "medium" ? "body1" : "body2";
  return (
    <TableContainer
      sx={{
        overflowX: "initial",
        [`& :last-of-type.${tableRowClasses.root}`]: {
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
        },
      }}
    >
      <Table aria-label="collapsible table" size={rowSize}>
        <TableBody>
          {oldProcess.name && (
            <TableRow sx={{minHeight: "60px"}}>
              <TableCell>
                <Typography fontWeight={500} variant={fontSize}>
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant={fontSize}>{oldProcess.name}</Typography>
              </TableCell>
              <TableCell width={"40px"}>
                <ArrowForwardIcon />
              </TableCell>
              <TableCell>
                <Typography variant={fontSize}>
                  {proposedChanges.name}
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {oldProcess.description && (
            <TableRow>
              <TableCell>
                <Typography fontWeight={500} variant={fontSize}>
                  Description
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant={fontSize}>
                  {oldProcess.description}
                </Typography>
              </TableCell>
              <TableCell width={"40px"}>
                <ArrowForwardIcon />
              </TableCell>
              <TableCell>
                <Typography variant={fontSize}>
                  {proposedChanges.description}
                </Typography>
              </TableCell>
            </TableRow>
          )}
          {oldProcess.options && (
            <TableRow>
              <TableCell>
                <Typography fontWeight={500} variant={fontSize}>
                  Options
                </Typography>
              </TableCell>
              <TableCell>
                <ProcessOptions
                  options={oldProcess.options as unknown as ProcessOption[]}
                />
              </TableCell>
              <TableCell width={"40px"}>
                <ArrowForwardIcon />
              </TableCell>
              <TableCell>
                <ProcessOptions
                  options={
                    proposedChanges.options as unknown as ProcessOption[]
                  }
                />
              </TableCell>
            </TableRow>
          )}
          {oldProcess.inputs && (
            <TableRow>
              <TableCell>
                <Typography fontWeight={500} variant={fontSize}>
                  Inputs
                </Typography>
              </TableCell>
              <TableCell>
                <SummarizeInputTemplates
                  variant={fontSize}
                  inputs={oldProcess.inputs}
                />
              </TableCell>
              <TableCell width={"40px"}>
                <ArrowForwardIcon />
              </TableCell>
              <TableCell>
                <SummarizeInputTemplates
                  variant={fontSize}
                  inputs={proposedChanges.inputs ?? []}
                />
              </TableCell>
            </TableRow>
          )}
          {oldProcess.action && (
            <TableRow>
              <TableCell>
                <Typography fontWeight={500} variant={fontSize}>
                  Custom integration
                </Typography>
              </TableCell>
              <TableCell>
                {oldProcess.action?.webhook ? (
                  <SummarizeAction
                    uri={oldProcess.action.webhook.uri as string}
                    optionTrigger={oldProcess.action.optionTrigger ?? undefined}
                  />
                ) : (
                  <Typography>No custom integration</Typography>
                )}
              </TableCell>
              <TableCell width={"40px"}>
                <ArrowForwardIcon />
              </TableCell>
              <TableCell>
                {proposedChanges.action?.webhook ? (
                  <SummarizeAction
                    uri={proposedChanges.action.webhook.uri as string}
                    optionTrigger={
                      proposedChanges.action.optionTrigger ?? undefined
                    }
                  />
                ) : (
                  <Typography>No custom integration</Typography>
                )}
              </TableCell>
            </TableRow>
          )}
          {oldProcess.request && (
            <TableRow>
              <TableCell>
                <Typography fontWeight={500} variant={fontSize}>
                  Request
                </Typography>
              </TableCell>
              <AvatarsCell avatars={oldProcess.request} align="left" />
              <TableCell width={"40px"}>
                <ArrowForwardIcon />
              </TableCell>
              <AvatarsCell
                avatars={proposedChanges.request as AvatarProps[]}
                align="left"
              />
            </TableRow>
          )}
          {oldProcess.respond && (
            <TableRow>
              <TableCell>
                <Typography fontWeight={500} variant={fontSize}>
                  Respond
                </Typography>
              </TableCell>
              <AvatarsCell avatars={oldProcess.respond} align="left" />
              <TableCell width={"40px"}>
                <ArrowForwardIcon />
              </TableCell>
              <AvatarsCell
                avatars={proposedChanges.respond as AvatarProps[]}
                align="left"
              />
            </TableRow>
          )}
          {/* <TableRow>
            <TableCell>
              <Typography fontWeight={500} variant={fontSize}>
                Edit
              </Typography>
            </TableCell>
            <AvatarsCell
              avatars={[oldProcess.edit] as AvatarProps[]}
              align="left"
            />
            <TableCell width={"40px"}>
              <ArrowForwardIcon />
            </TableCell>
            <AvatarsCell
              avatars={[proposedChanges.edit] as AvatarProps[]}
              align="left"
            />
          </TableRow> */}
          {oldProcess.decision && (
            <TableRow>
              <TableCell>
                <Typography fontWeight={500} variant={fontSize}>
                  Decision system
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant={fontSize}>
                  {summarizeDecisionSystemForm(oldProcess.decision)}
                </Typography>
              </TableCell>
              <TableCell width={"40px"}>
                <ArrowForwardIcon />
              </TableCell>
              <TableCell>
                <Typography variant={fontSize}>
                  {summarizeDecisionSystemForm(
                    proposedChanges.decision as ProcessDecision,
                  )}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";

import { Process } from "../../types";
import { intervalToIntuitiveTimeString } from "../../utils/inputs";
import { summarizeDecisionSystem } from "../shared/Process/summarizeDecisionSystem";

export const DecisionSystemSummaryTable = ({
  process,
}: {
  process: Process.default;
}) => {
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
      <Table aria-label="table" id={"decision-summary-table"}>
        <TableBody>
          <TableRow id={"decision-summary-row-1"}>
            <TableCell
              sx={(theme) => ({
                [theme.breakpoints.up("sm")]: {
                  width: "180px",
                },
              })}
            >
              <Typography variant="body1" fontWeight={500}>
                How decisions are made
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {summarizeDecisionSystem(process.decision)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow id={"decision-summary-row-2"}>
            <TableCell>
              <Typography variant="body1" fontWeight={500}>
                Request expiration
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {intervalToIntuitiveTimeString(
                  process.decision.requestExpirationSeconds * 1000,
                )}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";

import { ProcessSummaryPartsFragment } from "../../graphql/generated/graphql";
import { intervalToIntuitiveTimeString } from "../../utils/inputs";
import { summarizeDecisionSystem } from "../shared/Process/summarizeDecisionSystem";
import { reformatAgentForAvatar } from "../shared/Avatar";
import { AvatarsCell } from "../shared/Tables/TableCells";

export const DecisionSystemSummaryTable = ({
  process,
}: {
  process: ProcessSummaryPartsFragment;
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
          <TableRow id={"community-roles-row-1"}>
            <TableCell>
              <Typography variant="body1">
                <span style={{ fontWeight: 500 }}>Request</span>
                {/* : Who can
                trigger this process */}
              </Typography>
            </TableCell>
            <AvatarsCell
              align="left"
              avatars={process.roles.request.map((agent) => reformatAgentForAvatar(agent))}
            />
          </TableRow>
          <TableRow id={"community-roles-row-2"}>
            <TableCell>
              <Typography variant="body1">
                <span style={{ fontWeight: 500 }}>Respond</span>
                {/* : Who can
                respond to requests made by this process */}
              </Typography>
            </TableCell>
            <AvatarsCell
              align="left"
              avatars={process.roles.respond.map((agent) => reformatAgentForAvatar(agent))}
            />
          </TableRow>
          <TableRow id={"decision-summary-row-1"}>
            <TableCell
              sx={(theme) => ({
                [theme.breakpoints.up("sm")]: {
                  width: "240px",
                },
              })}
            >
              <Typography variant="body1" fontWeight={500}>
                How decisions are made
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {summarizeDecisionSystem(process.decisionSystem)}
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
                {intervalToIntuitiveTimeString(process.expirationSeconds * 1000)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Link, generatePath } from "react-router-dom";

import { ProcessSummaryPartsFragment } from "../../../graphql/generated/graphql";
import { Route } from "../../../routers/routes";
import {
  fullUUIDToShort,
  intervalToIntuitiveTimeString,
} from "../../../utils/inputs";
import { reformatAgentForAvatar } from "../Avatar";
import SummarizeAction from "../Process/SummarizeAction";
import { summarizeDecisionSystem } from "../Process/summarizeDecisionSystem";
import { AvatarsCell } from "../Tables/TableCells";

export const ProcessSummaryTable = ({
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
      <Table aria-label="collapsible table">
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1" fontWeight={500}>
                Process
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to={generatePath(Route.Process, {
                    processId: fullUUIDToShort(process.id),
                  })}
                >
                  {process.name}
                </Link>
              </Typography>
            </TableCell>
          </TableRow>
          {process.action?.actionDetails.__typename === "WebhookAction" ? (
            <TableRow>
              <TableCell>
                <Typography variant="body1" fontWeight={500}>
                  Custom integration
                </Typography>
              </TableCell>
              <TableCell>
                <SummarizeAction
                  uri={process.action.actionDetails.uri}
                  optionTrigger={process.action.optionFilter?.value}
                />
              </TableCell>
            </TableRow>
          ) : null}

          <TableRow>
            <TableCell>
              <Typography variant="body1" fontWeight={500}>
                How a decision is made
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {summarizeDecisionSystem(process.decisionSystem)}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1" fontWeight={500}>
                Who can respond
              </Typography>
            </TableCell>
            <AvatarsCell
              align="left"
              avatars={process.roles.respond.map((agent) =>
                reformatAgentForAvatar(agent),
              )}
            />
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1" fontWeight={500}>
                Request life
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {intervalToIntuitiveTimeString(
                  process.expirationSeconds * 1000,
                )}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";
import { Link } from "react-router-dom";

import { Process } from "../../../types";
import { Typography } from "@mui/material";
import { AvatarsCell } from "../Tables/TableCells";

export const ProcessSummaryTable = ({
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
                <Link to={`/process/${process.processId}`}>{process.name}</Link>
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1" fontWeight={500}>
                Description
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">{process.description}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableRow>
          <TableCell>
            <Typography variant="body1" fontWeight={500}>
              Who can respond
            </Typography>
          </TableCell>
          <AvatarsCell align="left" avatars={process.roles.respond} />
        </TableRow>
      </Table>
    </TableContainer>
  );
};

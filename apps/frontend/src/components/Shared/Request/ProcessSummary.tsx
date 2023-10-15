import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";
import { Link } from "react-router-dom";

import { ProcessProps } from "../Tables/mockData";
import { Typography } from "@mui/material";
import { AvatarsCell } from "../Tables/TableCells";

export const ProcessSummaryTable = ({ process }: { process: ProcessProps }) => {
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
              <Link to={`/process/${process.processId}`}>{process.name}</Link>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="body1" fontWeight={500}>
                Description
              </Typography>
            </TableCell>
            <TableCell>{process.description}</TableCell>
          </TableRow>
        </TableBody>
        <TableRow>
          <TableCell>
            <Typography variant="body1" fontWeight={500}>
              Who can responsd
            </Typography>
          </TableCell>
          <AvatarsCell align="left" avatars={process.rights.respond} />
        </TableRow>
      </Table>
    </TableContainer>
  );
};

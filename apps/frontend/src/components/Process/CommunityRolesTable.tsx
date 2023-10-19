import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";

import { Process } from "../../types";
import { AvatarsCell } from "../shared/Tables/TableCells";

export const CommunityRolesTable = ({
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
      <Table aria-label="table" id={"community-roles-table"}>
        <TableBody>
          <TableRow id={"community-roles-row-1"}>
            <TableCell>
              <Typography variant="body1">
                <span style={{ fontWeight: 500 }}>Request</span>: Who can
                trigger this process
              </Typography>
            </TableCell>
            <AvatarsCell align="center" avatars={process.roles.request} />
          </TableRow>
          <TableRow id={"community-roles-row-2"}>
            <TableCell>
              <Typography variant="body1">
                <span style={{ fontWeight: 500 }}>Respond</span>: Who can
                respond to requests made by this process
              </Typography>
            </TableCell>
            <AvatarsCell align="center" avatars={process.roles.respond} />
          </TableRow>
          <TableRow id={"community-roles-row-3"}>
            <TableCell>
              <Typography variant="body1">
                <span style={{ fontWeight: 500 }}>Edit</span>: Who can change
                how this process works over time
              </Typography>
            </TableCell>
            <AvatarsCell align="center" avatars={[process.roles.edit]} />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

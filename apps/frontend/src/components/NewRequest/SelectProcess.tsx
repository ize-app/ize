import ProcessTab from "../shared/Tables/ProcessesTable/ProcessTab";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { processMockData } from "../shared/Tables/mockData";
import { Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";

export const SelectProcess = () => {
  const navigate = useNavigate();

  const processes = processMockData.filter(
    (process) => process.userRoles.request,
  );
  return (
    <>
      <div>Select Process</div>
      <TableContainer component={Paper} sx={{ overflowX: "initial" }}>
        <Table aria-label="table" stickyHeader={true}>
          <TableBody>
            {processes.map((process) => (
              <TableRow
                key={process.processId}
                onClick={() => navigate(process.processId)}
              >
                <TableCell>
                  <Typography fontWeight={500}>{process.name}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

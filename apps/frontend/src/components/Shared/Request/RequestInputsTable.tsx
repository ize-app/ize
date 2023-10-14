import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import { RequestInput } from "../Tables/mockData";
import { Typography } from "@mui/material";

const RequestInputRow = ({ input }: { input: RequestInput }) => {
  return (
    <TableRow>
      <TableCell>
        <Typography color="primary" variant="body2">
          {input.property}
        </Typography>
      </TableCell>
      <TableCell>{input.value}</TableCell>
    </TableRow>
  );
};

export const RequestInputTable = ({ inputs }: { inputs: RequestInput[] }) => {
  return (
    <TableContainer
      sx={{
        overflowX: "initial",
        [`& .${tableCellClasses.root}`]: {
          borderBottom: "none",
        },
      }}
    >
      <Table aria-label="collapsible table" size="small">
        <TableBody>
          {inputs.map((input, index) => (
            <RequestInputRow
              input={input}
              key={"input" + index.toString()}
            ></RequestInputRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

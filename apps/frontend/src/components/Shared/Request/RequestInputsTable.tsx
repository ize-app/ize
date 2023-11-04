import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

export interface InputSummaryRow {
  name: string;
  value: string | number;
}

const RequestInputRow = ({
  input,
  fontSize,
}: {
  input: InputSummaryRow;
  fontSize: "body1" | "body2";
}) => {
  return (
    <TableRow>
      <TableCell>
        <Typography fontWeight={500} variant={fontSize}>
          {input.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant={fontSize}>{input.value}</Typography>
      </TableCell>
    </TableRow>
  );
};

export const RequestInputTable = ({
  inputs,
  rowSize,
}: {
  inputs: InputSummaryRow[];
  rowSize?: "small" | "medium";
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
      <Table aria-label="collapsible table" size={rowSize}>
        <TableBody>
          {inputs.map((input: InputSummaryRow, index) => (
            <RequestInputRow
              input={input}
              fontSize={rowSize === "medium" ? "body1" : "body2"}
              key={"input" + index.toString()}
            ></RequestInputRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";

import { ProcessSummaryPartsFragment } from "../../graphql/generated/graphql";
import { ProcessOptions } from "../shared/Process/ProcessOptions";

export const RequestTemplateTable = ({
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
      <Table aria-label="collapsible table" id={"request-template-table"}>
        <TableBody>
          <TableRow id={"request-template-row-1"}>
            <TableCell
              sx={(theme) => ({
                [theme.breakpoints.up("sm")]: {
                  width: "180px",
                },
              })}
            >
              <Typography variant="body1" fontWeight={500}>
                Options
              </Typography>
            </TableCell>
            <TableCell>
              <ProcessOptions options={process.options} />
            </TableCell>
          </TableRow>
          <TableRow id={"request-template-row-2"}>
            <TableCell>
              <Typography variant="body1" fontWeight={500}>
                Input fields
              </Typography>
            </TableCell>
            <TableCell>
              <ul style={{ padding: "0px 10px" }}>
                {process.inputs.map((input, index) => (
                  <li key={input.name + index.toString()}>
                    <Typography>
                      <span style={{ fontWeight: 500 }}>{input.name}</span> (
                      {input.type}): {input.description}`
                    </Typography>
                  </li>
                ))}
              </ul>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

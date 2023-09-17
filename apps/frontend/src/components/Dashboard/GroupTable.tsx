import * as React from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { GroupProps } from "./mockData";
import { TableCellHideable } from "./TableCells";

function GroupRow(props: { group: GroupProps }) {
  const { group } = props;

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
        }}
      >
        <TableCellHideable component="th" scope="row" align="left">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant={"body1"}
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "2",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {group.name}
            </Typography>
          </Box>
        </TableCellHideable>

        <TableCellHideable align={"right"}>
          <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <Typography>{group.type}</Typography>
          </Box>
        </TableCellHideable>
        <TableCellHideable align={"right"}>
          <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <Typography>{group.memberCount}</Typography>
          </Box>
        </TableCellHideable>
      </TableRow>
    </React.Fragment>
  );
}

export default function GroupTable({ groups }: { groups: GroupProps[] }) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial" }}>
      <Table aria-label="collapsible table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable sx={{ maxWidth: "50%" }}>
              Group
            </TableCellHideable>
            <TableCellHideable
              align="right"
              sx={{ minWidth: "100px" }}
              hideOnSmallScreen={true}
            >
              Group Type
            </TableCellHideable>
            <TableCellHideable
              hideOnSmallScreen={true}
              sx={{ minWidth: "100px" }}
              align="right"
            >
              Members
            </TableCellHideable>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <GroupRow key={group.groupId} group={group} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

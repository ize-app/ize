import * as React from "react";

import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { ProcessProps } from "./mockData";
import { AvatarsCell, TableCellHideable } from "./TableCells";

function ProcessRow(props: { process: ProcessProps }) {
  const { process } = props;

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
        }}
      >
        <TableCellHideable component="th" scope="row">
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
              {process.name}
            </Typography>
          </Box>
        </TableCellHideable>
        <AvatarsCell
          avatars={process.rights.request}
          hideOnSmallScreen={true}
        />
        <AvatarsCell
          avatars={process.rights.respond}
          hideOnSmallScreen={true}
        />
        <AvatarsCell avatars={process.rights.edit} hideOnSmallScreen={true} />
        <TableCellHideable align={"right"}>
          <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <Tooltip title="Edit">
              <IconButton
                children={<Edit />}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                color={"primary"}
                disabled={!process.userRights.edit}
                edge={"start"}
              />
            </Tooltip>
            <Tooltip title="Request">
              <IconButton
                children={<Add />}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                color={"primary"}
                disabled={!process.userRights.request}
              />
            </Tooltip>
          </Box>
        </TableCellHideable>{" "}
      </TableRow>
    </React.Fragment>
  );
}

export default function ProcessTable({
  processes,
}: {
  processes: ProcessProps[];
}) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial" }}>
      <Table aria-label="table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable sx={{ minWidth: "40%" }}>
              Process
            </TableCellHideable>
            <TableCellHideable
              align="center"
              // sx={{ minWidth: "100px" }}
              width="130px"
              hideOnSmallScreen={true}
            >
              Request
            </TableCellHideable>
            <TableCellHideable
              hideOnSmallScreen={true}
              // sx={{ minWidth: "100px" }}
              width="100px"
              align="center"
            >
              Respond
            </TableCellHideable>
            <TableCellHideable
              align="center"
              width={"100px"}
              hideOnSmallScreen={true}
            >
              Edit
            </TableCellHideable>
            <TableCell
              align="right"
              width={"140px"}
              sx={{ minWidth: "40%" }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processes.map((process) => (
            <ProcessRow key={process.processId} process={process} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

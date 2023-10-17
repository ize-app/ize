import * as React from "react";
import { generatePath, useNavigate } from "react-router-dom";

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

import { Process } from "../../../../types";
import { NewRequestRoute, newRequestRoute } from "../../../../routers/routes";
import { AvatarsCell, TableCellHideable } from "../TableCells";

function ProcessRow(props: { process: Process.default }) {
  const { process } = props;
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <TableRow onClick={() => navigate(`/process/${process.processId}`)}>
        <TableCell component="th" scope="row" align="left">
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
        </TableCell>
        <AvatarsCell
          align="center"
          avatars={process.roles.request}
          hideOnSmallScreen={true}
        />
        <AvatarsCell
          align="center"
          avatars={process.roles.respond}
          hideOnSmallScreen={true}
        />
        <AvatarsCell
          avatars={[process.roles.edit]}
          align="center"
          hideOnSmallScreen={true}
        />
        <TableCellHideable align={"right"}>
          <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <Tooltip title="Edit">
              <span>
                <IconButton
                  children={<Edit />}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  color={"primary"}
                  disabled={!process.userRoles.edit}
                  edge={"start"}
                />
              </span>
            </Tooltip>
            <Tooltip title="Request">
              <span>
                <IconButton
                  children={<Add />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      generatePath(
                        newRequestRoute(NewRequestRoute.CreateRequest),
                        {
                          processId: process.processId,
                        },
                      ),
                    );
                  }}
                  color={"primary"}
                  disabled={!process.userRoles.request}
                />
              </span>
            </Tooltip>
          </Box>
        </TableCellHideable>
      </TableRow>
    </React.Fragment>
  );
}

export default function ProcessTable({
  processes,
}: {
  processes: Process.default[];
}) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial" }}>
      <Table aria-label="table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable
            // sx={{ minWidth: "40%" }}
            >
              Process
            </TableCellHideable>
            <TableCellHideable
              align="center"
              // width="130px"
              hideOnSmallScreen={true}
            >
              Request
            </TableCellHideable>
            <TableCellHideable
              hideOnSmallScreen={true}
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

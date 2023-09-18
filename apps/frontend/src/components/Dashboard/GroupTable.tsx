import * as React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { AvatarWithName } from "../shared/Avatar";
import { GroupProps } from "./mockData";
import { TableCellHideable } from "./TableCells";

function GroupRow(props: { group: GroupProps }) {
  const { group } = props;
  const navigate = useNavigate();

  const handleTableRowOnClick = () => {
    navigate(`/groups/${group.groupId}`);
  };

  return (
    <React.Fragment>
      <TableRow onClick={handleTableRowOnClick}>
        <TableCellHideable component="th" scope="row" align="left">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <AvatarWithName
              name={group.name}
              avatarUrl={group.avatarURL}
              parent={
                group.parentGroup
                  ? {
                      name: group.parentGroup?.name,
                      avatarUrl: group.parentGroup?.avatarURL,
                    }
                  : undefined
              }
            />
          </Box>
        </TableCellHideable>

        <TableCellHideable align={"left"}>
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                height: "1rem",
                width: "auto",
              }}
              component="img"
              src="/discord-logo.png"
            />
            <Typography>
              {group.type === "Discord server" ? "Server" : "Role"}
            </Typography>
          </Box>
        </TableCellHideable>
        <TableCellHideable align={"right"}>
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
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
              align="left"
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

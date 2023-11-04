import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { GroupSummaryPartsFragment } from "../../../../graphql/generated/graphql";
import { fullUUIDToShort } from "../../../../utils/inputs";
import { AvatarWithName } from "../../Avatar";
import { TableCellHideable } from "../TableCells";

function GroupRow(props: { group: GroupSummaryPartsFragment }) {
  const { group } = props;
  const navigate = useNavigate();

  const handleTableRowOnClick = () => {
    navigate(`/groups/${fullUUIDToShort(group.id)}`);
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
              color={group.color}
              name={group.name}
              avatarUrl={group.icon}
            />
          </Box>
        </TableCellHideable>
        <TableCellHideable component="th" scope="row" align="left">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <AvatarWithName
              name={group.organization.name}
              avatarUrl={group.organization.icon}
            />
          </Box>
        </TableCellHideable>
        <TableCellHideable align={"right"} hideOnSmallScreen={true}>
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            <Typography>{group.memberCount ?? 34}</Typography>
          </Box>
        </TableCellHideable>
      </TableRow>
    </React.Fragment>
  );
}

export default function GroupTable({
  groups,
}: {
  groups: GroupSummaryPartsFragment[];
}) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial" }}>
      <Table aria-label="collapsible table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable sx={{ width: "1000%" }}>Group</TableCellHideable>
            <TableCellHideable
              align="center"
              sx={{ minWidth: "100px" }}
              hideOnSmallScreen={true}
            >
              Server
            </TableCellHideable>
            <TableCellHideable
              hideOnSmallScreen={true}
              sx={{ minWidth: "100px" }}
              align="center"
            >
              Members
            </TableCellHideable>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <GroupRow key={group.id} group={group} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

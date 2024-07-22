import { Check as CheckIcon } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { generatePath, useNavigate } from "react-router-dom";

import { Avatar } from "@/components/Avatar";
import { WatchGroupButton } from "@/components/group/WatchGroupButton/WatchGroupButton";
import { TableCellHideable } from "@/components/Tables/TableCells";
import { GroupSummaryPartsFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

export const GroupsTable = ({ groups }: { groups: GroupSummaryPartsFragment[] }) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial", minWidth: "360px" }}>
      <Table aria-label="Groups Table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable width="60px" />
            {/* <TableCellHideable width="60px" /> */}
            <TableCellHideable sx={{ minWidth: "140px" }}>Group</TableCellHideable>
            <TableCellHideable sx={{ width: "60px" }} align="center">
              Member
            </TableCellHideable>
            <TableCellHideable sx={{ width: "60px" }} align="center">
              Created
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
};

const GroupRow = ({ group }: { group: GroupSummaryPartsFragment }) => {
  const navigate = useNavigate();
  return (
    <>
      <TableRow
        aria-label="Group Row"
        onClick={() =>
          navigate(
            generatePath(Route.Group, {
              groupId: fullUUIDToShort(group.id),
            }),
          )
        }
      >
        <TableCell>
          <WatchGroupButton size="small" groupId={group.id} watched={group.isWatched} />
        </TableCell>
        <TableCell component="th" scope="row" align="left">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "8px",
            }}
          >
            <Avatar avatar={group} />
            <Typography
              variant={"body1"}
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: "2",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
              }}
            >
              {group.name}
            </Typography>
          </Box>
        </TableCell>
        <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
          {group.isMember ? <CheckIcon color={"success"} fontSize="small" /> : null}
        </TableCellHideable>
        <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
          {new Date(group.createdAt).toLocaleDateString()}
        </TableCellHideable>
      </TableRow>
    </>
  );
};

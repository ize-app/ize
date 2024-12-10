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

import { Avatar, AvatarGroup } from "@/components/Avatar";
import { TableCellHideable } from "@/components/Tables/TableCellHideable";
import { WatchGroupButton } from "@/components/watchButton/WatchGroupButton";
import { IzeGroupFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

export const GroupsTable = ({ groups }: { groups: IzeGroupFragment[] }) => {
  return (
    <TableContainer sx={{ overflowX: "initial", minWidth: "300px" }}>
      <Table aria-label="Groups Table" stickyHeader={true}>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-root": {
                padding: "0px",
              },
            }}
          >
            <TableCellHideable width="60px" />
            {/* <TableCellHideable width="60px" /> */}
            <TableCellHideable sx={{ minWidth: "140px" }} />
            {/* <TableCellHideable hideOnSmallScreen /> */}
            <TableCellHideable sx={{ width: "60px" }} align="center">
              Members
            </TableCellHideable>

            <TableCellHideable sx={{ width: "60px" }} align="center" hideOnSmallScreen>
              Created
            </TableCellHideable>
          </TableRow>
        </TableHead>
        <TableBody component={Paper}>
          {groups.map((group) => (
            <GroupRow key={group.groupId} group={group} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const GroupRow = ({ group }: { group: IzeGroupFragment }) => {
  const navigate = useNavigate();
  return (
    <TableRow
      aria-label="Group Row"
      onClick={() =>
        navigate(
          generatePath(Route.Group, {
            groupId: fullUUIDToShort(group.groupId),
          }),
        )
      }
    >
      <TableCell>
        <WatchGroupButton size="small" groupId={group.groupId} watched={group.isWatched} />
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
          <Avatar avatar={group.group} />
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
            {group.group.name}
          </Typography>
        </Box>
      </TableCell>
      {/* <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
          {group.isMember ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px",
                // width: "74px",
              }}
            >
              <CheckIcon color={"success"} fontSize="small" />
              <Typography
                variant="description"
                fontSize={".75rem"}
                color={theme.palette.success.main}
              >
                Member
              </Typography>
            </Box>
          ) : null}
        </TableCellHideable> */}
      <TableCellHideable align="center" width={"100px"}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // width: "100%",
            // backgroundColor: "red",
          }}
        >
          <AvatarGroup avatars={group.members} />
        </Box>
      </TableCellHideable>
      <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
        {new Date(group.group.createdAt).toLocaleDateString()}
      </TableCellHideable>
    </TableRow>
  );
};

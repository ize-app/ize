import Add from "@mui/icons-material/AddBoxOutlined";
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
import { FlowSummaryFragment } from "@/graphql/generated/graphql";
import { TableCellHideable, AvatarsCell } from "@/components/Tables/TableCells";
import { generatePath, useNavigate } from "react-router-dom";
import { NewRequestRoute, Route, newRequestRoute } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

export const FlowsTable = ({ flows }: { flows: FlowSummaryFragment[] }) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial" }}>
      <Table aria-label="table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable sx={{ minWidth: "60%" }}>Flow</TableCellHideable>
            <TableCellHideable align="right" width={"60px"}>
              Creator
            </TableCellHideable>

            <TableCell align="right" width={"60px"}>
              Trigger
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flows.map((flow) => (
            <FlowRow key={flow.flowId} flow={flow} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const FlowRow = ({ flow }: { flow: FlowSummaryFragment }) => {
  const navigate = useNavigate();
  return (
    <>
      <TableRow
        onClick={() =>
          navigate(
            generatePath(Route.Flow, {
              flowId: fullUUIDToShort(flow.flowId),
            }),
          )
        }
      >
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
              {flow.name}
            </Typography>
          </Box>
        </TableCell>
        <AvatarsCell align="center" avatars={[flow.creator]} hideOnSmallScreen={true} />
        <TableCellHideable align={"right"}>
          <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <Tooltip title="Trigger flow">
              <span>
                <IconButton
                  children={<Add />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      generatePath(newRequestRoute(NewRequestRoute.CreateRequest), {
                        flowId: fullUUIDToShort(flow.flowId),
                      }),
                    );
                  }}
                  color={"primary"}
                  disabled={!flow.userPermission.request}
                />
              </span>
            </Tooltip>
          </Box>
        </TableCellHideable>
      </TableRow>
    </>
  );
};

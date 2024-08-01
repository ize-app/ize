import Add from "@mui/icons-material/AddBoxOutlined";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { generatePath, useNavigate } from "react-router-dom";

import { AvatarGroup } from "@/components/Avatar";
import { TableCellHideable } from "@/components/Tables/TableCellHideable";
import { WatchFlowButton } from "@/components/watchButton/WatchFlowButton";
import { FlowSummaryFragment } from "@/graphql/generated/graphql";
import { NewRequestRoute, newRequestRoute } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

export const FlowsTable = ({
  flows,
  onClickRow,
  hideTriggerButton = false,
  hideWatchButton = false,
}: {
  flows: FlowSummaryFragment[];
  onClickRow: (flow: FlowSummaryFragment) => void;
  hideTriggerButton?: boolean;
  hideWatchButton?: boolean;
}) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial", minWidth: "360px" }}>
      <Table aria-label="Flows Table" stickyHeader={true}>
        {/* <TableHead>
          <TableRow>
            <TableCellHideable align="right" width={"60px"}></TableCellHideable>
            <TableCellHideable sx={{ minWidth: "140px" }}>Flow</TableCellHideable>

            <TableCellHideable align="right" width={"60px"} hideOnSmallScreen></TableCellHideable>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {flows.map((flow) => (
            <FlowRow
              key={flow.flowId}
              flow={flow}
              hideTriggerButton={hideTriggerButton}
              hideWatchButton={hideWatchButton}
              onClickRow={onClickRow}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const FlowRow = ({
  flow,
  onClickRow,
  hideTriggerButton,
  hideWatchButton,
}: {
  flow: FlowSummaryFragment;
  onClickRow: (flow: FlowSummaryFragment) => void;
  hideTriggerButton: boolean;
  hideWatchButton: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <>
      <TableRow
        aria-label="Flow Row"
        onClick={() => {
          onClickRow(flow);
        }}
      >
        {!hideWatchButton && (
          <TableCell width="60px">
            <WatchFlowButton size="small" flowId={flow.flowId} watched={flow.isWatched} />
          </TableCell>
        )}
        {/* <AvatarsCell
          align="center"
          width={"60px"}
          avatars={flow.group ? [flow.group] : null}
          hideOnSmallScreen={true}
        /> */}
        <TableCell component="th" scope="row" align="left">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {flow.group ? <AvatarGroup avatars={[flow.group]} /> : null}
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

        {!hideTriggerButton && (
          <TableCellHideable align={"right"}>
            <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Tooltip
                title={
                  flow.userPermission.request
                    ? "Trigger flow"
                    : "You don't have trigger permissions"
                }
              >
                <span>
                  <IconButton
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
                  >
                    <Add />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </TableCellHideable>
        )}
      </TableRow>
    </>
  );
};

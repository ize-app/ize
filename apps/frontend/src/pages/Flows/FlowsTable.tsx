import Add from "@mui/icons-material/AddBoxOutlined";
import { TableHead } from "@mui/material";
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
  // groupId here means that the flow is being displayed in a group context
  groupId,
}: {
  flows: FlowSummaryFragment[];
  onClickRow: (flow: FlowSummaryFragment) => void;
  hideTriggerButton?: boolean;
  hideWatchButton?: boolean;
  groupId?: string;
}) => {
  return (
    <TableContainer sx={{ overflowX: "initial", minWidth: "300px" }}>
      <Table aria-label="Flows watched by this group Table" stickyHeader={true}>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-root": {
                padding: "0px",
              },
            }}
          >
            {/* watching button */}
            {!hideWatchButton && <TableCellHideable width="60px" />}
            {/* flow name */}
            <TableCellHideable sx={{ minWidth: "140px" }} />

            {!groupId && (
              <TableCellHideable sx={{ width: "60px" }} align="center" hideOnSmallScreen>
                Watching
              </TableCellHideable>
            )}

            <TableCellHideable hideOnSmallScreen sx={{ width: "60px" }} align="center">
              Created
            </TableCellHideable>

            <TableCellHideable
              hideOnSmallScreen
              sx={{ width: "60px" }}
              align="center"
            ></TableCellHideable>
          </TableRow>
        </TableHead>

        <TableBody component={Paper}>
          {flows.map((flow) => (
            <FlowRow
              key={flow.flowId}
              flow={flow}
              hideTriggerButton={hideTriggerButton}
              hideWatchButton={hideWatchButton}
              onClickRow={onClickRow}
              groupId={groupId}
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
  groupId,
}: {
  flow: FlowSummaryFragment;
  onClickRow: (flow: FlowSummaryFragment) => void;
  hideTriggerButton: boolean;
  hideWatchButton: boolean;
  // groupId here means that the flow is being displayed in a group context
  groupId?: string;
}) => {
  const navigate = useNavigate();
  return (
    <>
      <TableRow
        aria-label="Flow Row"
        sx={{
          height: "78px",
        }}
        onClick={() => {
          onClickRow(flow);
        }}
      >
        {!hideWatchButton && (
          <TableCell width="60px">
            <WatchFlowButton size="small" flowId={flow.flowId} watched={flow.watching.user} />
          </TableCell>
        )}
        <TableCell component="th" scope="row" align="left">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {flow.group && !groupId && (
              <Box sx={{ display: "flex", flexDirection: "row", gap: "4px" }}>
                <AvatarGroup avatars={[flow.group]} size="14px" />
                <Typography
                  variant="description"
                  // color="primary"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "1",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Modifies &apos;{flow.group.name}&apos;
                </Typography>
              </Box>
            )}
            <Typography
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
        {!groupId && (
          <TableCellHideable width={"60px"} align="center" hideOnSmallScreen>
            {flow.watching.groups.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <AvatarGroup avatars={flow.watching.groups} />
              </Box>
            )}
          </TableCellHideable>
        )}
        <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
          {new Date(flow.createdAt).toLocaleDateString()}
        </TableCellHideable>

        {!hideTriggerButton && (
          <TableCellHideable hideOnSmallScreen align={"right"}>
            <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Tooltip
                title={
                  flow.trigger.userPermission
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
                    disabled={!flow.trigger.userPermission}
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

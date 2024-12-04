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
  // groupId here means that the flow is being displayed in a group context
  groupId,
}: {
  flows: FlowSummaryFragment[];
  onClickRow: (flow: FlowSummaryFragment) => void;
  hideTriggerButton?: boolean;
  hideWatchButton?: boolean;
  groupId?: string;
}) => {
  if (groupId) {
    const groupFlows = flows.filter((flow) => flow.group?.id === groupId);
    const otherFlows = flows.filter((flow) => flow.group?.id !== groupId);
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {otherFlows.length > 0 ? (
          <>
            <Typography variant={"label2"} marginTop={"8px"}>
              Flows watched by this group
            </Typography>
            <TableContainer component={Paper} sx={{ overflowX: "initial", minWidth: "360px" }}>
              <Table aria-label="Flows watched by this group Table" stickyHeader={true}>
                <TableBody>
                  {otherFlows.map((flow) => (
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
            <Typography variant={"label2"}>Flows that modify this group</Typography>
            <TableContainer component={Paper} sx={{ overflowX: "initial", minWidth: "360px" }}>
              <Table aria-label="Flows that modify this group Table" stickyHeader={true}>
                <TableBody>
                  {groupFlows.map((flow) => (
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
          </>
        ) : null}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial", minWidth: "360px" }}>
      <Table aria-label="Flows Table" stickyHeader={true}>
        <TableBody>
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
        {!hideWatchButton && !groupId && (
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
                WebkitLineClamp: "1",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {flow.name}
            </Typography>
          </Box>
        </TableCell>
        {!groupId && (
          <TableCellHideable hideOnSmallScreen width={"180px"}>
            {flow.watching.groups.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "6px" }}>
                <Typography variant="description" color="textSecondary">
                  Watched by
                </Typography>
                <AvatarGroup avatars={flow.watching.groups} />
              </Box>
            )}
          </TableCellHideable>
        )}

        {!hideTriggerButton && (
          <TableCellHideable align={"right"}>
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

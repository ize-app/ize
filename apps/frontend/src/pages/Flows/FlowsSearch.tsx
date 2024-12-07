import { Button, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useContext } from "react";
import { Link } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import { FlowsFilterToggle } from "@/components/Tables/FlowsFilterToggle.tsx";
import { GroupsFilterToggle } from "@/components/Tables/GroupsFilterToggle.tsx";
import Search from "@/components/Tables/Search";
import { FlowSummaryFragment, FlowWatchFilter } from "@/graphql/generated/graphql.ts";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import useFlowsSearch from "@/hooks/useFlowsSearch";
import { Route } from "@/routers/routes.ts";

import { FlowsTable } from "./FlowsTable.tsx";

export const FlowsSearch = ({
  groupId,
  onClickRow,
  onlyShowTriggerable = false,
  hideWatchButton = false,
}: {
  groupId?: string;
  onClickRow: (flow: FlowSummaryFragment) => void;
  onlyShowTriggerable?: boolean;
  hideWatchButton?: boolean;
}) => {
  const queryResultLimit = 20;

  const { me } = useContext(CurrentUserContext);

  const theme = useTheme();
  const isMdScreenSize = useMediaQuery(theme.breakpoints.down("md"));
  const {
    hasTriggerPermissions,
    setHasTriggerPermission,
    flowWatchFilter,
    setFlowWatchFilter,
    selectedGroupId,
    setGroupId,
    searchQuery,
    setSearchQuery,
    oldCursor,
    setOldCursor,
    newCursor,
    flows,
    loading,
    createdByUser,
    setCreatedByUser,
    fetchMore,
    queryVars,
  } = useFlowsSearch({
    groupId,
    queryResultLimit,
    initialFlowWatchFilter: groupId ? FlowWatchFilter.All : FlowWatchFilter.WatchedByMeOrMyGroups,
    initialHasTriggerPermissions: onlyShowTriggerable ? true : false,
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        height: "100%",
        width: "100%",
        minWidth: "0",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minWidth: "0",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          gap: "16px",
          // minWidth: "360px",
        }}
      >
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Search
            searchQuery={searchQuery}
            changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(event.target.value);
            }}
          />
          {!!me && <CreateButton />}
        </Box>
        <ToggleButtonGroup sx={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
          <FlowsFilterToggle
            flowWatchFilter={flowWatchFilter}
            showWatchedByGroupsOption={!groupId}
            setWatchFlowFilter={setFlowWatchFilter}
          />
          {!groupId && (
            <GroupsFilterToggle
              setSelectedGroupId={setGroupId}
              selectedGroupId={selectedGroupId}
              groups={me?.groups ?? []}
            />
          )}
          {!onlyShowTriggerable && (
            <ToggleButton
              size="small"
              value={hasTriggerPermissions}
              selected={hasTriggerPermissions}
              sx={{ width: "140px", flexShrink: 0, height: "30px" }}
              color="primary"
              onChange={() => {
                setHasTriggerPermission(!hasTriggerPermissions);
              }}
            >
              Flows I can trigger
            </ToggleButton>
          )}
          {!isMdScreenSize && (
            <ToggleButton
              size="small"
              value={createdByUser}
              selected={createdByUser}
              sx={{ width: "140px", flexShrink: 0, height: "30px" }}
              color="primary"
              onChange={() => {
                setCreatedByUser(!createdByUser);
              }}
            >
              Created by me
            </ToggleButton>
          )}
        </ToggleButtonGroup>
      </Box>
      {loading && flows.length === 0 ? (
        <Loading />
      ) : flows.length > 0 ? (
        <FlowsTable
          flows={flows}
          groupId={groupId}
          onClickRow={onClickRow}
          hideTriggerButton={false}
          hideWatchButton={hideWatchButton}
        />
      ) : (
        <EmptyTablePlaceholder>
          <Typography>
            There aren&apos;t any flows yet. Learn more <Link to={Route.About}>here</Link> or{" "}
            <Link to={Route.NewFlow}>create your first flow</Link>. <br />
          </Typography>
        </EmptyTablePlaceholder>
      )}
      {/* if there are no new results or no results at all, then hide the "load more" button */}
      {oldCursor !== newCursor && (flows.length ?? 0) >= queryResultLimit && (
        <Button
          onClick={() => {
            setOldCursor(newCursor);
            return fetchMore({
              variables: {
                ...queryVars,
                cursor: newCursor,
              },
            });
          }}
        >
          Load more
        </Button>
      )}
    </Box>
  );
};

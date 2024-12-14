import { Button, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useContext } from "react";
import { Link } from "react-router-dom";

import Loading from "@/components/Loading";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import { FilterMenu } from "@/components/Tables/FilterMenu.tsx";
import { FlowWatchFilterToggle } from "@/components/Tables/FlowWatchFilterToggle.tsx";
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

  const theme = useTheme();
  const isSmallScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleButtons = [];

  const flowWatchToggle = (
    <FlowWatchFilterToggle
      flowWatchFilter={flowWatchFilter}
      showWatchedByGroupsOption={!groupId}
      setWatchFlowFilter={setFlowWatchFilter}
    />
  );

  const groupFilterToggle = (
    <GroupsFilterToggle
      setSelectedGroupId={setGroupId}
      selectedGroupId={selectedGroupId}
      groups={me?.groups ?? []}
    />
  );

  const triggerPermissionToggle = (
    <ToggleButton
      size="small"
      value={hasTriggerPermissions}
      selected={hasTriggerPermissions}
      sx={(theme) => ({
        width: "140px",
        flexShrink: 0,
        height: "30px",
        [theme.breakpoints.down("sm")]: {
          width: "100%",
          justifyContent: "space-between",
        },
      })}
      color="primary"
      onChange={() => {
        setHasTriggerPermission(!hasTriggerPermissions);
      }}
    >
      Flows I can trigger
    </ToggleButton>
  );

  const createdByMeToggle = (
    <ToggleButton
      size="small"
      value={createdByUser}
      selected={createdByUser}
      sx={(theme) => ({
        width: "140px",
        flexShrink: 0,
        height: "30px",
        [theme.breakpoints.down("sm")]: {
          width: "100%",
          justifyContent: "space-between",
        },
      })}
      color="primary"
      onChange={() => {
        setCreatedByUser(!createdByUser);
      }}
    >
      Created by me
    </ToggleButton>
  );

  toggleButtons.push(flowWatchToggle);
  if (!groupId) toggleButtons.push(groupFilterToggle);
  if (!onlyShowTriggerable) toggleButtons.push(triggerPermissionToggle);
  toggleButtons.push(createdByMeToggle);

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
        width: "100%",
        outline: `1px solid ${theme.palette.grey[200]}`,
        padding: "12px",
      })}
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
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Search
            searchQuery={searchQuery}
            changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(event.target.value);
            }}
          />

          {isSmallScreenSize ? (
            <FilterMenu toggleButtons={toggleButtons} />
          ) : (
            <ToggleButtonGroup
              sx={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {toggleButtons}
            </ToggleButtonGroup>
          )}
        </Box>
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
            <Link to={Route.NewFlow}>Create a flow</Link>
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

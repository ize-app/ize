import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { FlowsSearchBar } from "@/components/searchBars/FlowsSearchBar.tsx";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import { FlowSummaryFragment, WatchFilter } from "@/graphql/generated/graphql.ts";
import useFlowsSearch from "@/hooks/useFlowsSearch";
import { Route } from "@/routers/routes.ts";

import { FlowsTable } from "./FlowsTable.tsx";

export const FlowsSearch = ({
  groupId,
  initialWatchFilter = WatchFilter.Watched,
  onClickRow,
  hideTriggerButton = false,
  hideWatchButton = false,
  hideTriggerFilterButton = false,
  hideCreateButton = false,
}: {
  groupId?: string;
  initialWatchFilter?: WatchFilter;
  onClickRow: (flow: FlowSummaryFragment) => void;
  hideTriggerButton?: boolean;
  hideWatchButton?: boolean;
  hideTriggerFilterButton?: boolean;
  hideCreateButton?: boolean;
}) => {
  const queryResultLimit = 20;
  const {
    watchFilter,
    setWatchFilter,
    triggerPermissionFilter,
    setTriggerPermissionFilter,
    searchQuery,
    setSearchQuery,
    oldCursor,
    setOldCursor,
    newCursor,
    flows,
    loading,
    fetchMore,
    queryVars,
  } = useFlowsSearch({ groupId, queryResultLimit, initialWatchFilter });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          gap: "16px",
          minWidth: "360px",
        }}
      >
        <FlowsSearchBar
          watchFilter={watchFilter}
          setWatchFilter={setWatchFilter}
          triggerPermissionFilter={triggerPermissionFilter}
          setTriggerPermissionFilter={setTriggerPermissionFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          hideTriggerFilterButton={hideTriggerFilterButton}
        />
        {!hideCreateButton && <CreateButton />}
      </Box>
      {loading ? (
        <Loading />
      ) : flows.length > 0 ? (
        <FlowsTable
          flows={flows}
          onClickRow={onClickRow}
          hideTriggerButton={hideTriggerButton}
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

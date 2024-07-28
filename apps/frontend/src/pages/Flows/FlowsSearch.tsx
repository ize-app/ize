import { Button, ToggleButton } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import Search from "@/components/Tables/Search";
import { FlowTriggerPermissionFilter, WatchFilter } from "@/graphql/generated/graphql.ts";
import { Route } from "@/routers/routes.ts";

import { FlowsTable } from "./FlowsTable.tsx";
import useFlowsSearch from "./useFlowsSearch.ts";

export const FlowsSearch = ({
  groupId,
  initialWatchFilter = WatchFilter.Watched,
}: {
  groupId?: string;
  initialWatchFilter?: WatchFilter;
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
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            width: "100%",
            // maxWidth: "500px",
            [theme.breakpoints.down("md")]: {
              flexDirection: "column",
            },
          })}
        >
          <Search
            searchQuery={searchQuery}
            changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(event.target.value);
            }}
          />
          <Box sx={{ display: "flex", gap: "8px" }}>
            <ToggleButton
              size="small"
              value="check"
              selected={triggerPermissionFilter === FlowTriggerPermissionFilter.TriggerPermission}
              sx={{ width: "140px" }}
              color="primary"
              onChange={() => {
                // setSelected(!selected);
                setTriggerPermissionFilter(
                  triggerPermissionFilter === FlowTriggerPermissionFilter.TriggerPermission
                    ? FlowTriggerPermissionFilter.All
                    : FlowTriggerPermissionFilter.TriggerPermission,
                );
              }}
            >
              Trigger permission
            </ToggleButton>

            <ToggleButton
              size="small"
              value={watchFilter}
              selected={watchFilter === WatchFilter.Watched}
              sx={{ width: "140px" }}
              color="primary"
              onChange={() => {
                // setSelected(!selected);
                setWatchFilter(
                  watchFilter === WatchFilter.Watched ? WatchFilter.All : WatchFilter.Watched,
                );
              }}
            >
              Watched flows
            </ToggleButton>
          </Box>
        </Box>
        <CreateButton />
      </Box>
      {loading ? (
        <Loading />
      ) : flows.length > 0 ? (
        <FlowsTable flows={flows} />
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

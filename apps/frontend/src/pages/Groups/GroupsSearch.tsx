import { Button, ToggleButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent } from "react";
import { Link, generatePath } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import Search from "@/components/Tables/Search";
import { WatchFilter } from "@/graphql/generated/graphql";
import useGroupsSearch from "@/hooks/useGroupsSearch";
import { NewCustomGroupRoute, newCustomGroupRoute } from "@/routers/routes";

import { GroupsTable } from "./GroupsTable";

export const GroupsSearch = () => {
  const queryResultLimit = 20;

  const {
    searchQuery,
    setSearchQuery,
    watchFilter,
    setWatchFilter,
    setOldCursor,
    oldCursor,
    newCursor,
    groups,
    loading,
    fetchMore,
    queryVars,
  } = useGroupsSearch({
    queryResultLimit,
    initialWatchFilter: WatchFilter.Watched,
    acknowledged: true,
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // gap: "0px",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", gap: "30px" }}>
          <Search
            searchQuery={searchQuery}
            changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(event.target.value);
            }}
          />
          <CreateButton />
        </Box>
        <ToggleButton
          size="small"
          value="check"
          selected={watchFilter === WatchFilter.Watched}
          sx={{ width: "160px", height: "30px" }}
          color="primary"
          onChange={() => {
            setWatchFilter(
              watchFilter === WatchFilter.Watched ? WatchFilter.All : WatchFilter.Watched,
            );
          }}
        >
          Watched groups
        </ToggleButton>
      </Box>

      {loading && groups.length == 0 ? (
        <Loading />
      ) : groups.length > 0 ? (
        <GroupsTable groups={groups} />
      ) : (
        <EmptyTablePlaceholder>
          <Typography>
            You aren&apos;t a part of any Ize groups (yet!).{" "}
            <Link to={generatePath(newCustomGroupRoute(NewCustomGroupRoute.Setup))}>
              Create a group
            </Link>
            .
          </Typography>
        </EmptyTablePlaceholder>
      )}
      {/* if there are no new results or no results at all, then hide the "load more" button */}
      {oldCursor !== newCursor && (groups.length ?? 0) >= queryResultLimit && (
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

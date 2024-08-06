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
  } = useGroupsSearch({ queryResultLimit, initialWatchFilter: WatchFilter.Watched });

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
            maxWidth: "500px",
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
          <ToggleButton
            size="small"
            value="check"
            selected={watchFilter === WatchFilter.Watched}
            sx={{ width: "160px" }}
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
        <CreateButton />
      </Box>
      {loading ? (
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

import { useLazyQuery } from "@apollo/client";
import { Button, MenuItem, Typography, debounce } from "@mui/material";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, generatePath } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import Search from "@/components/Tables/Search";
import {
  GroupSummaryPartsFragment,
  GroupsDocument,
  GroupsQueryVariables,
  WatchGroupFilter,
} from "@/graphql/generated/graphql";
import { NewCustomGroupRoute } from "@/routers/routes";

import { GroupsTable } from "./GroupsTable";

const filters = [
  { label: "All", value: WatchGroupFilter.All },
  { label: "Watched", value: WatchGroupFilter.Watched },
  { label: "Unwatched", value: WatchGroupFilter.Unwatched },
];

export const GroupsSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const [watchFilter, setWatchFilter] = useState<WatchGroupFilter>(WatchGroupFilter.Watched);
  const queryResultLimit = 20;

  const queryVars: GroupsQueryVariables = {
    searchQuery,
    limit: queryResultLimit,
    watchFilter,
  };

  // const [statusToggle, setStatusToggle] = useState<"open" | "closed">("open");

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GroupsDocument);

  const debouncedRefetch = debounce(() => {
    setOldCursor(undefined);
    getResults({ variables: queryVars });
  }, 1000);

  useEffect(() => {
    debouncedRefetch();
  }, [searchQuery, watchFilter]);

  useEffect(() => {
    getResults({ variables: queryVars });
  }, []);

  const newCursor = data?.groupsForCurrentUser.length
    ? data.groupsForCurrentUser[data.groupsForCurrentUser.length - 1].id
    : "";
  const groups = (data?.groupsForCurrentUser ?? []) as GroupSummaryPartsFragment[];

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
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <Search
            searchQuery={searchQuery}
            changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(event.target.value);
            }}
          />
          <Select
            sx={{
              width: "140px",
            }}
            inputProps={{ multiline: "true" }}
            aria-label={"Request step filter"}
            defaultValue={watchFilter}
            size={"small"}
            onChange={(event) => {
              setWatchFilter(event.target.value as WatchGroupFilter);
              return;
            }}
          >
            {filters.map((filter) => (
              <MenuItem key={filter.value} value={filter.value}>
                {filter.label}
              </MenuItem>
            ))}
          </Select>
          {/* <StatusToggle status={statusToggle} setStatus={setStatusToggle} /> */}
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
            You aren&apos;t a part of any Ize groups (yet!)
            <Link to={generatePath(NewCustomGroupRoute.Setup)}>Create a group</Link>.
          </Typography>
        </EmptyTablePlaceholder>
      )}
      {/* if there are no new results or no results at all, then hide the "load more" button */}
      {oldCursor !== newCursor && (data?.groupsForCurrentUser.length ?? 0) >= queryResultLimit && (
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

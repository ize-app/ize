import { Button, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import Search from "@/components/Tables/Search";
import { WatchFilter } from "@/graphql/generated/graphql.ts";
import { Route } from "@/routers/routes.ts";

import { FlowsTable } from "./FlowsTable.tsx";
import useFlowsSearch from "./useFlowsSearch.ts";

const filters = [
  { label: "All", value: WatchFilter.All },
  { label: "Watched", value: WatchFilter.Watched },
  { label: "Unwatched", value: WatchFilter.Unwatched },
];

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
              setWatchFilter(event.target.value as WatchFilter);
              return;
            }}
          >
            {filters.map((filter) => (
              <MenuItem key={filter.value} value={filter.value}>
                {filter.label}
              </MenuItem>
            ))}
          </Select>
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
            Looks like you don&apos;t have any flows set up yet. Learn more{" "}
            <Link to={Route.NewFlow}>here</Link> or{" "}
            <Link to={Route.NewFlow}>create your first flow</Link>. <br />
            <br />
            <span style={{ fontWeight: 500 }}>Flows</span> define and automate how a set of people
            (Discord roles, NFTs, email addresses, etc) collectively take an action together. For
            example, a flow could define how to:
            <ul>
              <li>
                Ask for a group&apos;s opinions and use AI to create a summary of the hivemind
              </li>
              <li>
                Vote on whether to give someone Discord @moderator permissions, and automatically
                give assign that role if the vote passes
              </li>
              <li>
                Solicit group ideas on initiatives, prioritize the ideas, and output results to
                Airtable.
              </li>
            </ul>
            <br />
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

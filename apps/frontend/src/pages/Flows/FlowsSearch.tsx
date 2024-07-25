import { useLazyQuery } from "@apollo/client";
import { Button, MenuItem, debounce } from "@mui/material";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import Search from "@/components/Tables/Search";
import {
  FlowSummaryFragment,
  GetFlowsDocument,
  GetFlowsQueryVariables,
  RequestStepFilter,
} from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes.ts";

import { FlowsTable } from "./FlowsTable.tsx";

const filters = [
  { label: "All", value: RequestStepFilter.All },
  { label: "Open", value: RequestStepFilter.Open },
  { label: "Closed", value: RequestStepFilter.Closed },
];

export const FlowsSearch = ({ groupId }: { groupId?: string }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<RequestStepFilter>(RequestStepFilter.Open);
  const queryResultLimit = 20;

  const queryVars: GetFlowsQueryVariables = {
    groupId,
    searchQuery,
    limit: queryResultLimit,
  };

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GetFlowsDocument);

  const debouncedRefetch = debounce(() => {
    setOldCursor(undefined);
    getResults({ variables: queryVars });
  }, 1000);

  useEffect(() => {
    debouncedRefetch();
  }, [searchQuery, filter]);

  useEffect(() => {
    getResults({ variables: queryVars });
  }, []);

  const newCursor = data?.getFlows.length ? data.getFlows[data.getFlows.length - 1].flowId : "";
  const flows = (data?.getFlows ?? []) as FlowSummaryFragment[];

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
            defaultValue={filter}
            size={"small"}
            onChange={(event) => {
              setFilter(event.target.value as RequestStepFilter);
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
      {oldCursor !== newCursor && (data?.getFlows.length ?? 0) >= queryResultLimit && (
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

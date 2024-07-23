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
  GetRequestStepsDocument,
  GetRequestStepsQueryVariables,
  RequestStepFilter,
  RequestStepSummaryFragment,
} from "@/graphql/generated/graphql";
import { NewRequestRoute, Route, newRequestRoute } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { RequestStepsTable } from "./RequestStepsTable";

const filters = [
  { label: "All", value: RequestStepFilter.All },
  { label: "Open", value: RequestStepFilter.Open },
  { label: "Closed", value: RequestStepFilter.Closed },
];

export const RequestStepsSearch = ({
  userOnly,
  flowId,
  groupId,
}: {
  userOnly: boolean;
  groupId?: string;
  flowId?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<RequestStepFilter>(RequestStepFilter.Open);
  const queryResultLimit = 20;

  const queryVars: GetRequestStepsQueryVariables = {
    userOnly,
    flowId,
    groupId,
    searchQuery,
    limit: queryResultLimit,
    filter,
  };

  // const [statusToggle, setStatusToggle] = useState<"open" | "closed">("open");

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GetRequestStepsDocument);

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

  const newCursor = data?.getRequestSteps.length
    ? data.getRequestSteps[data.getRequestSteps.length - 1].id
    : "";
  const requestSteps = (data?.getRequestSteps ?? []) as RequestStepSummaryFragment[];

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
      ) : requestSteps.length > 0 ? (
        <RequestStepsTable requestSteps={requestSteps} />
      ) : (
        <EmptyTablePlaceholder>
          {!flowId ? (
            <Typography>
              You don&apos;t have any requests. Create a <Link to={Route.NewFlow}>flow</Link> first
              or a <Link to={Route.NewRequest}>request</Link> or for an existing flow.
            </Typography>
          ) : (
            <Typography>
              You don&apos;t have any requests for this flow. Create a{" "}
              <Link
                to={generatePath(newRequestRoute(NewRequestRoute.CreateRequest), {
                  flowId: fullUUIDToShort(flowId),
                })}
              >
                request
              </Link>{" "}
              for this flow.
            </Typography>
          )}
        </EmptyTablePlaceholder>
      )}
      {/* if there are no new results or no results at all, then hide the "load more" button */}
      {oldCursor !== newCursor && (data?.getRequestSteps.length ?? 0) >= queryResultLimit && (
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

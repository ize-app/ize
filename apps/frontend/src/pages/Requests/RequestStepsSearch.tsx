import { useLazyQuery } from "@apollo/client";
import { Button, ToggleButton, Typography, debounce } from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, generatePath } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import Search from "@/components/Tables/Search";
import {
  GetRequestStepsDocument,
  GetRequestStepsQueryVariables,
  RequestStepRespondPermissionFilter,
  RequestStepStatusFilter,
  RequestStepSummaryFragment,
} from "@/graphql/generated/graphql";
import { NewRequestRoute, Route, newRequestRoute } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { RequestStepsTable } from "./RequestStepsTable";

export const RequestStepsSearch = ({
  userOnly,
  flowId,
  groupId,
  initialRespondPermissionFilter = RequestStepRespondPermissionFilter.RespondPermission,
}: {
  userOnly: boolean;
  groupId?: string;
  flowId?: string;
  initialRespondPermissionFilter?: RequestStepRespondPermissionFilter;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<RequestStepStatusFilter>(
    RequestStepStatusFilter.Open,
  );
  const [respondPermissionFilter, setRespondPermissionFilter] =
    useState<RequestStepRespondPermissionFilter>(initialRespondPermissionFilter);
  const queryResultLimit = 20;

  const queryVars: GetRequestStepsQueryVariables = {
    userOnly,
    flowId,
    groupId,
    searchQuery,
    limit: queryResultLimit,
    statusFilter,
    respondPermissionFilter,
  };

  // const [statusToggle, setStatusToggle] = useState<"open" | "closed">("open");

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GetRequestStepsDocument);

  const debouncedRefetch = debounce(() => {
    setOldCursor(undefined);
    getResults({ variables: queryVars });
  }, 1000);

  useEffect(() => {
    debouncedRefetch();
  }, [searchQuery, statusFilter, respondPermissionFilter]);

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
              selected={statusFilter === RequestStepStatusFilter.Open}
              sx={{ width: "140px" }}
              color="primary"
              onChange={() => {
                // setSelected(!selected);
                setStatusFilter(
                  statusFilter === RequestStepStatusFilter.Open
                    ? RequestStepStatusFilter.All
                    : RequestStepStatusFilter.Open,
                );
              }}
            >
              Open requests
            </ToggleButton>
            <ToggleButton
              size="small"
              value="check"
              selected={
                respondPermissionFilter === RequestStepRespondPermissionFilter.RespondPermission
              }
              sx={{ width: "160px" }}
              color="primary"
              onChange={() => {
                // setSelected(!selected);
                setRespondPermissionFilter(
                  respondPermissionFilter === RequestStepRespondPermissionFilter.RespondPermission
                    ? RequestStepRespondPermissionFilter.All
                    : RequestStepRespondPermissionFilter.RespondPermission,
                );
              }}
            >
              Respond permission
            </ToggleButton>
            {/* <Select
              sx={{
                width: "100px",
              }}
              inputProps={{ multiline: "true" }}
              aria-label={"Request step open/closed filter"}
              defaultValue={statusFilter}
              size={"small"}
              onChange={(event) => {
                setStatusFilter(event.target.value as RequestStepStatusFilter);
                return;
              }}
            >
              {requestStepStatusFilters.map((filter) => (
                <MenuItem key={filter.value} value={filter.value}>
                  {filter.label}
                </MenuItem>
              ))}
            </Select>
            <Select
              sx={{
                width: "200px",
              }}
              aria-label={"Request step respond permission filter"}
              defaultValue={respondPermissionFilter}
              size={"small"}
              onChange={(event) => {
                setRespondPermissionFilter(
                  event.target.value as RequestStepRespondPermissionFilter,
                );
                return;
              }}
            >
              {requestStepPermissionFilters.map((filter) => (
                <MenuItem key={filter.value} value={filter.value}>
                  {filter.label}
                </MenuItem>
              ))}
            </Select> */}
          </Box>
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

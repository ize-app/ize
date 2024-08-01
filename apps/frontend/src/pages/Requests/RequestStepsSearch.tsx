import { Button, ToggleButton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent } from "react";
import { Link, generatePath } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import Search from "@/components/Tables/Search";
import {
  RequestStepRespondPermissionFilter,
  RequestStepStatusFilter,
} from "@/graphql/generated/graphql";
import { NewRequestRoute, Route, newRequestRoute } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { RequestStepsTable } from "./RequestStepsTable";
import useRequestStepsSearch from "./useRequestStepsSearch";

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
  const queryResultLimit = 20;
  const {
    searchQuery,
    setSearchQuery,
    respondPermissionFilter,
    setRespondPermissionFilter,
    statusFilter,
    setStatusFilter,
    setOldCursor,
    oldCursor,
    newCursor,
    requestSteps,
    queryVars,
    loading,
    fetchMore,
  } = useRequestStepsSearch({
    userOnly,
    groupId,
    flowId,
    queryResultLimit,
    initialRespondPermissionFilter,
  });

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
          </Box>
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
              {groupId ? "This group doesn't " : "You don&apos;t "}have any requests. Create a{" "}
              <Link to={Route.NewFlow}>flow</Link> first or a{" "}
              <Link to={Route.NewRequest}>request</Link> or for an existing flow.
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
      {oldCursor !== newCursor && (requestSteps.length ?? 0) >= queryResultLimit && (
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

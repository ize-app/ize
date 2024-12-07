import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent, useContext } from "react";
import { Link, generatePath } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import { FlowsFilterToggle } from "@/components/Tables/FlowsFilterToggle";
import { GroupsFilterToggle } from "@/components/Tables/GroupsFilterToggle";
import { RequestStatusToggle } from "@/components/Tables/RequestStatusToggle";
import Search from "@/components/Tables/Search";
import { FlowWatchFilter } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import useRequestsSearch from "@/hooks/useRequestsSearch";
import { NewRequestRoute, Route, newRequestRoute } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { RequestSummaryTable } from "./RequestsTable";

export const RequestSearch = ({
  initialFlowWatchFilter,
  flowId,
  groupId,
}: {
  initialFlowWatchFilter: FlowWatchFilter;
  groupId?: string;
  flowId?: string;
}) => {
  const queryResultLimit = 20;

  const theme = useTheme();
  const isMdScreenSize = useMediaQuery(theme.breakpoints.down("md"));

  const {
    searchQuery,
    setSearchQuery,
    hasRespondPermission,

    createdByUser,
    requestStatusFilter,
    selectedGroupId,
    setHasRespondPermission,
    flowWatchFilter,
    setFlowWatchFilter,
    setCreatedByUser,
    setRequestStatusFilter,
    setSelectedGroupId,
    setOldCursor,
    oldCursor,
    newCursor,
    requestSteps,
    queryVars,
    loading,
    fetchMore,
  } = useRequestsSearch({
    groupId,
    flowId,
    queryResultLimit,
    initialFlowWatchFilter,
  });

  const { me } = useContext(CurrentUserContext);

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
          minWidth: "0",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Search
            searchQuery={searchQuery}
            changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(event.target.value);
            }}
          />
          {me && <CreateButton />}
        </Box>
        <ToggleButtonGroup sx={{ display: "flex", flexWrap: "wrap" }}>
          <RequestStatusToggle
            requestStatusFilter={requestStatusFilter}
            setRequestStatusFilter={setRequestStatusFilter}
          />
          {!flowId && (
            <FlowsFilterToggle
              flowWatchFilter={flowWatchFilter}
              showWatchedByGroupsOption={!groupId}
              setWatchFlowFilter={setFlowWatchFilter}
            />
          )}
          {!groupId && !flowId && (
            <GroupsFilterToggle
              setSelectedGroupId={setSelectedGroupId}
              selectedGroupId={selectedGroupId}
              groups={me?.groups ?? []}
            />
          )}
          {!isMdScreenSize && (
            <>
              <ToggleButton
                size="small"
                value={createdByUser}
                selected={createdByUser}
                sx={{ width: "140px", height: "30px" }}
                color="primary"
                onChange={() => {
                  setCreatedByUser(!createdByUser);
                }}
              >
                Created by me
              </ToggleButton>
              <ToggleButton
                size="small"
                value={hasRespondPermission}
                selected={hasRespondPermission}
                sx={{ width: "140px", height: "30px" }}
                color="primary"
                onChange={() => {
                  setHasRespondPermission(!hasRespondPermission);
                }}
              >
                I can respond
              </ToggleButton>
            </>
          )}
        </ToggleButtonGroup>
      </Box>
      {loading && requestSteps.length === 0? (
        <Loading />
      ) : requestSteps.length > 0 ? (
        <RequestSummaryTable requests={requestSteps} />
      ) : (
        <EmptyTablePlaceholder>
          {!flowId ? (
            <Typography>
              {groupId ? "This group doesn't " : "You don't "}have any requests. Create a{" "}
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

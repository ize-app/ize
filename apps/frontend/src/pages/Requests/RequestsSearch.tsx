import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent, useContext, useEffect } from "react";
import { Link, generatePath } from "react-router-dom";

import Loading from "@/components/Loading";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import { FilterMenu } from "@/components/Tables/FilterMenu";
import { FlowWatchFilterToggle } from "@/components/Tables/FlowWatchFilterToggle";
import { GroupsFilterToggle } from "@/components/Tables/GroupsFilterToggle";
import { RequestStatusToggle } from "@/components/Tables/RequestStatusToggle";
import Search from "@/components/Tables/Search";
import { FlowWatchFilter, RequestStatusFilter } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import useRequestsSearch from "@/hooks/useRequestsSearch";
import { NewRequestRoute, newRequestRoute } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { RequestSummaryTable } from "./RequestsTable";

export const RequestSearch = ({
  initialFlowWatchFilter,
  initialRequestStatusFilter,
  initialNeedsResponseFilter,
  flowId,
  groupId,
  showRequestStatusFilter,
  showNeedsResponseFilter,
}: {
  initialFlowWatchFilter: FlowWatchFilter;
  initialRequestStatusFilter: RequestStatusFilter;
  initialNeedsResponseFilter: boolean;
  showRequestStatusFilter: boolean;
  showNeedsResponseFilter: boolean;
  groupId?: string;
  flowId?: string;
}) => {
  const queryResultLimit = 20;

  const {
    searchQuery,
    setSearchQuery,
    needsResponse,
    createdByUser,
    requestStatusFilter,
    selectedGroupId,
    setNeedsResponse,
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
    initialNeedsResponseFilter,
    initialRequestStatusFilter,
  });

  useEffect(() => {
    if (requestStatusFilter === RequestStatusFilter.Final) {
      setNeedsResponse(false);
    }
  }, [requestStatusFilter]);

  const theme = useTheme();
  const isSmallScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

  const { me } = useContext(CurrentUserContext);

  const toggleButtons = [];

  const requestStatusToggle = (
    <RequestStatusToggle
      requestStatusFilter={requestStatusFilter}
      setRequestStatusFilter={setRequestStatusFilter}
    />
  );

  const needsResponseToggle = (
    <ToggleButton
      size="small"
      value={needsResponse}
      selected={needsResponse}
      sx={(theme) => ({
        width: "140px",
        height: "30px",
        [theme.breakpoints.down("sm")]: {
          width: "100%",
          justifyContent: "space-between",
        },
      })}
      color="primary"
      onChange={() => {
        setNeedsResponse(!needsResponse);
      }}
    >
      Needs response
    </ToggleButton>
  );

  const groupsFilterToggle = (
    <GroupsFilterToggle
      setSelectedGroupId={setSelectedGroupId}
      selectedGroupId={selectedGroupId}
      groups={me?.groups ?? []}
    />
  );

  const flowWatchToggle = (
    <FlowWatchFilterToggle
      flowWatchFilter={flowWatchFilter}
      showWatchedByGroupsOption={!groupId}
      setWatchFlowFilter={setFlowWatchFilter}
    />
  );

  const createdByUserToggle = (
    <ToggleButton
      size="small"
      value={createdByUser}
      selected={createdByUser}
      sx={(theme) => ({
        width: "140px",
        height: "30px",
        [theme.breakpoints.down("sm")]: {
          width: "100%",
          justifyContent: "space-between",
        },
      })}
      color="primary"
      onChange={() => {
        setCreatedByUser(!createdByUser);
      }}
    >
      Created by me
    </ToggleButton>
  );

  if (showRequestStatusFilter) toggleButtons.push(requestStatusToggle);
  if (showNeedsResponseFilter) toggleButtons.push(needsResponseToggle);
  if (!flowId) toggleButtons.push(flowWatchToggle);
  if (!groupId && !flowId) toggleButtons.push(groupsFilterToggle);
  toggleButtons.push(createdByUserToggle);

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
        width: "100%",
        outline: `1px solid ${theme.palette.grey[200]}`,
        padding: "12px",
      })}
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
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Search
            searchQuery={searchQuery}
            changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(event.target.value);
            }}
          />
          {isSmallScreenSize ? (
            <FilterMenu toggleButtons={toggleButtons} />
          ) : (
            <ToggleButtonGroup
              sx={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {toggleButtons}
            </ToggleButtonGroup>
          )}
        </Box>
      </Box>
      {loading && requestSteps.length === 0 ? (
        <Loading />
      ) : requestSteps.length > 0 ? (
        <RequestSummaryTable requests={requestSteps} />
      ) : (
        <EmptyTablePlaceholder>
          {!flowId ? (
            <Typography>No results</Typography>
          ) : (
            <Typography>
              No results.{" "}
              <Link
                to={generatePath(newRequestRoute(NewRequestRoute.CreateRequest), {
                  flowId: fullUUIDToShort(flowId),
                })}
              >
                Trigger this flow
              </Link>
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

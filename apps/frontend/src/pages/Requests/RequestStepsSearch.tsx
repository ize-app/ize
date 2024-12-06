import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  ToggleButton,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent, useContext } from "react";
import { Link, generatePath } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import Search from "@/components/Tables/Search";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import useRequestStepsSearch from "@/hooks/useRequestStepsSearch";
import { NewRequestRoute, Route, newRequestRoute } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { RequestSummaryTable } from "./RequestStepsTable";

export const RequestSearch = ({
  userOnly,
  flowId,
  groupId,
}: {
  userOnly: boolean;
  groupId?: string;
  flowId?: string;
}) => {
  const queryResultLimit = 20;
  const {
    searchQuery,
    setSearchQuery,
    hasRespondPermission,
    watchedByUser,
    watchedByUserGroups,
    createdByUser,
    open,
    selectedGroupId,
    setHasRespondPermission,
    setWatchedByUser,
    setWatchedByUserGroups,
    setCreatedByUser,
    setOpen,
    setSelectedGroupId,
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", width: "100%", minWidth: "0", gap: "8px" }}>
            <ToggleButton
              size="small"
              value={open}
              selected={open}
              sx={{ width: "80px", height: "30px" }}
              color="primary"
              onChange={() => {
                setOpen(!open);
              }}
            >
              Open
            </ToggleButton>
            {!flowId && (
              <ToggleButton
                size="small"
                value={watchedByUser}
                selected={watchedByUser}
                sx={{ width: "160px", height: "30px" }}
                color="primary"
                onChange={() => {
                  setWatchedByUser(!watchedByUser);
                }}
              >
                Watched by me
              </ToggleButton>
            )}
            {!groupId && !flowId && (
              <ToggleButton
                size="small"
                value={watchedByUserGroups}
                selected={watchedByUserGroups}
                sx={{ width: "160px", height: "30px" }}
                color="primary"
                onChange={() => {
                  setWatchedByUserGroups(!watchedByUserGroups);
                }}
              >
                Watched by my groups
              </ToggleButton>
            )}
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
            {!groupId && !flowId && (
              <Select
                sx={{
                  width: "160px",
                  height: "30px",
                  flexShrink: 0,
                }}
                size="small"
                value={selectedGroupId ?? "all"}
                onChange={(event: SelectChangeEvent<typeof selectedGroupId>) => {
                  setSelectedGroupId(event.target.value === "all" ? undefined : event.target.value);
                }}
              >
                <MenuItem value={"all"}>All groups</MenuItem>
                {me?.groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Box>
        </Box>
      </Box>
      {loading ? (
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

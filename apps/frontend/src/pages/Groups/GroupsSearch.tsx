import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import { ChangeEvent } from "react";
import { Link, generatePath } from "react-router-dom";

import Loading from "@/components/Loading";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder";
import { FilterMenu } from "@/components/Tables/FilterMenu";
import { GroupWatchFilterToggle } from "@/components/Tables/GroupWatchFilterToggle";
import Search from "@/components/Tables/Search";
import { GroupWatchFilter } from "@/graphql/generated/graphql";
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
    isMember,
    setIsMember,
    setOldCursor,
    oldCursor,
    newCursor,
    groups,
    loading,
    fetchMore,
    queryVars,
  } = useGroupsSearch({
    queryResultLimit,
    initialWatchFilter: GroupWatchFilter.Watched,
    initialIsMember: false,
  });

  const theme = useTheme();
  const isSmallScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

  const groupWatchToggle = (
    <GroupWatchFilterToggle setWatchFilter={setWatchFilter} watchFilter={watchFilter} />
  );

  const memberToggle = (
    <ToggleButton
      size="small"
      value={isMember}
      selected={isMember}
      sx={(theme) => ({
        height: "30px",
        [theme.breakpoints.down("sm")]: {
          width: "100%",
          justifyContent: "space-between",
        },
      })}
      color="primary"
      onChange={() => {
        setIsMember(!isMember);
      }}
    >
      Groups I am a member of
    </ToggleButton>
  );

  const toggleButtons = [groupWatchToggle, memberToggle];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
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

      {loading && groups.length == 0 ? (
        <Loading />
      ) : groups.length > 0 ? (
        <GroupsTable groups={groups} />
      ) : (
        <EmptyTablePlaceholder>
          <Typography>
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

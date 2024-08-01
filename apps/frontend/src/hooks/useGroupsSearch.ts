import { useLazyQuery } from "@apollo/client";
import { debounce } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  GroupSummaryPartsFragment,
  GroupsDocument,
  GroupsQueryVariables,
  WatchFilter,
} from "@/graphql/generated/graphql";

const useGroupsSearch = ({
  queryResultLimit,
  initialWatchFilter = WatchFilter.Watched,
}: {
  queryResultLimit: number;
  initialWatchFilter?: WatchFilter;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const [watchFilter, setWatchFilter] = useState<WatchFilter>(initialWatchFilter);

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GroupsDocument);

  const newCursor = data?.groupsForCurrentUser.length
    ? data.groupsForCurrentUser[data.groupsForCurrentUser.length - 1].id
    : "";

  const queryVarsRef = useRef<GroupsQueryVariables>({
    searchQuery,
    watchFilter,
    limit: queryResultLimit,
    cursor: newCursor,
  });

  const debouncedRefetch = useCallback(
    debounce(() => {
      getResults({ variables: queryVarsRef.current });
    }, 1000),
    [],
  );

  // Refetch when searchQuery or watchFilter changes
  // Note: if you change any of these variables you also need to change apollo client "merge" function
  useEffect(() => {
    setOldCursor(undefined);
    queryVarsRef.current = {
      searchQuery,
      watchFilter,
      limit: queryResultLimit,
      cursor: undefined,
    };
    debouncedRefetch();
  }, [searchQuery, queryResultLimit, watchFilter]);

  // Update queryVarsRef with the new cursor if there is new data
  useEffect(() => {
    queryVarsRef.current = {
      ...queryVarsRef.current,
      cursor: newCursor,
    };
  }, [newCursor]);

  // Initial fetch on page load
  useEffect(() => {
    getResults({ variables: queryVarsRef.current });
  }, []);
  const groups = (data?.groupsForCurrentUser ?? []) as GroupSummaryPartsFragment[];

  return {
    searchQuery,
    setSearchQuery,
    watchFilter,
    setWatchFilter,
    setOldCursor,
    oldCursor,
    newCursor,
    groups,
    loading,
    fetchMore,
    queryVars: queryVarsRef.current,
  };
};

export default useGroupsSearch;

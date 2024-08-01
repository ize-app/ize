import { useLazyQuery } from "@apollo/client";
import { debounce } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  FlowSummaryFragment,
  FlowTriggerPermissionFilter,
  GetFlowsDocument,
  GetFlowsQueryVariables,
  WatchFilter,
} from "@/graphql/generated/graphql";

const useFlowsSearch = ({
  groupId,
  queryResultLimit,
  initialWatchFilter = WatchFilter.Watched,
  initialTriggerPermissionFilter = FlowTriggerPermissionFilter.All,
}: {
  groupId?: string;
  queryResultLimit: number;
  initialWatchFilter?: WatchFilter;
  initialTriggerPermissionFilter?: FlowTriggerPermissionFilter;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const [watchFilter, setWatchFilter] = useState<WatchFilter>(initialWatchFilter);
  const [triggerPermissionFilter, setTriggerPermissionFilter] =
    useState<FlowTriggerPermissionFilter>(initialTriggerPermissionFilter);

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GetFlowsDocument);

  const newCursor = data?.getFlows.length ? data.getFlows[data.getFlows.length - 1].flowId : "";

  const queryVarsRef = useRef<GetFlowsQueryVariables>({
    groupId,
    searchQuery,
    watchFilter,
    triggerPermissionFilter,
    limit: queryResultLimit,
    cursor: newCursor,
  });

  const debouncedRefetch = useCallback(
    debounce(() => {
      getResults({ variables: queryVarsRef.current });
    }, 1000),
    [],
  );

  // Refetch when searchQuery, watchFilter, or triggerPermissionFilter changes
  // Note: if you change any of these variables you also need to change apollo client "merge" function
  useEffect(() => {
    setOldCursor(undefined);
    queryVarsRef.current = {
      groupId,
      searchQuery,
      watchFilter,
      triggerPermissionFilter,
      limit: queryResultLimit,
      cursor: undefined,
    };
    debouncedRefetch();
  }, [groupId, searchQuery, queryResultLimit, watchFilter, triggerPermissionFilter]);

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
  const flows = (data?.getFlows ?? []) as FlowSummaryFragment[];

  return {
    searchQuery,
    setSearchQuery,
    triggerPermissionFilter,
    setTriggerPermissionFilter,
    watchFilter,
    setWatchFilter,
    setOldCursor,
    oldCursor,
    newCursor,
    flows,
    loading,
    fetchMore,
    queryVars: queryVarsRef.current,
  };
};

export default useFlowsSearch;

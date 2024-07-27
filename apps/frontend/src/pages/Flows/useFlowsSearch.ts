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

  const queryVarsRef = useRef<GetFlowsQueryVariables>({
    groupId,
    searchQuery,
    watchFilter,
    triggerPermissionFilter,
    limit: queryResultLimit,
  });

  useEffect(() => {
    queryVarsRef.current = {
      groupId,
      searchQuery,
      watchFilter,
      triggerPermissionFilter,
      limit: queryResultLimit,
    };
  }, [groupId, searchQuery, queryResultLimit, watchFilter, triggerPermissionFilter]);

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GetFlowsDocument);

  const debouncedRefetch = useCallback(
    debounce(() => {
      setOldCursor(undefined);
      getResults({ variables: queryVarsRef.current });
    }, 1000),
    [],
  );

  useEffect(() => {
    debouncedRefetch();
  }, [searchQuery, debouncedRefetch, watchFilter, triggerPermissionFilter]);

  useEffect(() => {
    getResults({ variables: queryVarsRef.current });
  }, []);

  const newCursor = data?.getFlows.length ? data.getFlows[data.getFlows.length - 1].flowId : "";
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

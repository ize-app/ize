import { useLazyQuery } from "@apollo/client";
import { debounce } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  FlowSummaryFragment,
  GetFlowsDocument,
  GetFlowsQueryVariables,
  WatchFilter,
} from "@/graphql/generated/graphql";

const useFlowsSearch = ({
  groupId,
  queryResultLimit,
  initialWatchFilter = WatchFilter.Watched,
}: {
  groupId?: string;
  queryResultLimit: number;
  initialWatchFilter?: WatchFilter;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const [watchFilter, setWatchFilter] = useState<WatchFilter>(initialWatchFilter);

  const queryVarsRef = useRef<GetFlowsQueryVariables>({
    groupId,
    searchQuery,
    watchFilter,
    limit: queryResultLimit,
  });

  useEffect(() => {
    queryVarsRef.current = {
      groupId,
      searchQuery,
      watchFilter,
      limit: queryResultLimit,
    };
  }, [groupId, searchQuery, queryResultLimit, watchFilter]);

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
  }, [searchQuery, debouncedRefetch, watchFilter]);

  useEffect(() => {
    getResults({ variables: queryVarsRef.current });
  }, []);

  const newCursor = data?.getFlows.length ? data.getFlows[data.getFlows.length - 1].flowId : "";
  const flows = (data?.getFlows ?? []) as FlowSummaryFragment[];

  return {
    searchQuery,
    setSearchQuery,
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

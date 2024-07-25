import { useLazyQuery } from "@apollo/client";
import { debounce } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  FlowSummaryFragment,
  GetFlowsDocument,
  GetFlowsQueryVariables,
} from "@/graphql/generated/graphql";

const useFlowsSearch = ({
  groupId,
  queryResultLimit,
}: {
  groupId?: string;
  queryResultLimit: number;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);

  const queryVarsRef = useRef<GetFlowsQueryVariables>({
    groupId,
    searchQuery,
    limit: queryResultLimit,
  });

  useEffect(() => {
    queryVarsRef.current = {
      groupId,
      searchQuery,
      limit: queryResultLimit,
    };
  }, [groupId, searchQuery, queryResultLimit]);

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
  }, [searchQuery, debouncedRefetch]);

  useEffect(() => {
    getResults({ variables: queryVarsRef.current });
  }, []);

  const newCursor = data?.getFlows.length ? data.getFlows[data.getFlows.length - 1].flowId : "";
  const flows = (data?.getFlows ?? []) as FlowSummaryFragment[];

  return {
    searchQuery,
    setSearchQuery,
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

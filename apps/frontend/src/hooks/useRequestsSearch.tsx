import { useLazyQuery } from "@apollo/client";
import { debounce } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  FlowWatchFilter,
  GetRequestsDocument,
  GetRequestsQueryVariables,
  RequestStatusFilter,
  RequestSummaryFragment,
} from "@/graphql/generated/graphql";

const useRequestsSearch = ({
  initialFlowWatchFilter,
  groupId,
  flowId,
  queryResultLimit,
}: {
  initialFlowWatchFilter: FlowWatchFilter;
  groupId?: string;
  flowId?: string;
  queryResultLimit: number;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const [hasRespondPermission, setHasRespondPermission] = useState<boolean>(false);
  const [flowWatchFilter, setFlowWatchFilter] = useState<FlowWatchFilter>(initialFlowWatchFilter);

  const [createdByUser, setCreatedByUser] = useState<boolean>(false);
  const [requestStatusFilter, setRequestStatusFilter] = useState<RequestStatusFilter>(
    RequestStatusFilter.Open,
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(groupId);

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GetRequestsDocument, {
    // fetchPolicy: "network-only",
  });

  const newCursor = data?.getRequests.length
    ? data.getRequests[data.getRequests.length - 1].requestId // might want to change this to requestStepId depending on caching
    : "";

  const queryVarsRef = useRef<GetRequestsQueryVariables>({
    flowId,
    groupId: selectedGroupId,
    searchQuery,
    limit: queryResultLimit,
    hasRespondPermission,
    flowWatchFilter,
    createdByUser,
    requestStatusFilter,
    cursor: newCursor,
  });

  const debouncedRefetch = useCallback(
    debounce(() => {
      getResults({ variables: queryVarsRef.current });
    }, 1000),
    [],
  );

  // Refetch when searchQuery, watchFilter, or respondPermissionFilter, groupId changes
  // Note: if you change any of these variables you also need to change apollo client "merge" function
  useEffect(() => {
    setOldCursor(undefined);
    queryVarsRef.current = {
      flowId,
      groupId: selectedGroupId,
      searchQuery,
      hasRespondPermission,
      flowWatchFilter,
      createdByUser,
      requestStatusFilter,
      limit: queryResultLimit,
      cursor: undefined,
    };
    debouncedRefetch();
  }, [
    selectedGroupId,
    flowId,
    searchQuery,
    queryResultLimit,
    hasRespondPermission,
    flowWatchFilter,
    createdByUser,
    requestStatusFilter,
  ]);

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
  const requestSteps = (data?.getRequests ?? []) as RequestSummaryFragment[];

  return {
    searchQuery,
    hasRespondPermission,
    createdByUser,
    requestStatusFilter,
    selectedGroupId,
    setSearchQuery,
    setHasRespondPermission,
    setCreatedByUser,
    setRequestStatusFilter,
    setSelectedGroupId,
    flowWatchFilter,
    setFlowWatchFilter,
    setOldCursor,
    oldCursor,
    newCursor,
    requestSteps,
    loading,
    fetchMore,
    queryVars: queryVarsRef.current,
  };
};

export default useRequestsSearch;

import { useLazyQuery } from "@apollo/client";
import { debounce } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  GetRequestsDocument,
  GetRequestsQueryVariables,
  RequestStepRespondPermissionFilter,
  RequestStepStatusFilter,
  RequestSummaryFragment,
} from "@/graphql/generated/graphql";

const useRequestStepsSearch = ({
  userOnly,
  groupId,
  flowId,
  queryResultLimit,
  initialRespondPermissionFilter,
}: {
  userOnly: boolean;
  groupId?: string;
  flowId?: string;
  queryResultLimit: number;
  initialRespondPermissionFilter: RequestStepRespondPermissionFilter;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<RequestStepStatusFilter>(
    RequestStepStatusFilter.Open,
  );
  const [respondPermissionFilter, setRespondPermissionFilter] =
    useState<RequestStepRespondPermissionFilter>(initialRespondPermissionFilter);

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GetRequestsDocument);

  const newCursor = data?.getRequests.length
    ? data.getRequests[data.getRequests.length - 1].requestStepId
    : "";

  const queryVarsRef = useRef<GetRequestsQueryVariables>({
    userOnly,
    flowId,
    groupId,
    searchQuery,
    limit: queryResultLimit,
    statusFilter,
    respondPermissionFilter,
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
      userOnly,
      flowId,
      groupId,
      searchQuery,
      limit: queryResultLimit,
      statusFilter,
      respondPermissionFilter,
      cursor: undefined,
    };
    debouncedRefetch();
  }, [groupId, flowId, searchQuery, queryResultLimit, statusFilter, respondPermissionFilter]);

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
    setSearchQuery,
    respondPermissionFilter,
    setRespondPermissionFilter,
    statusFilter,
    setStatusFilter,
    setOldCursor,
    oldCursor,
    newCursor,
    requestSteps,
    loading,
    fetchMore,
    queryVars: queryVarsRef.current,
  };
};

export default useRequestStepsSearch;

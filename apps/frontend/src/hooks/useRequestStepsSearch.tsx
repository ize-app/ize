import { useLazyQuery } from "@apollo/client";
import { debounce } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  GetRequestStepsDocument,
  GetRequestStepsQueryVariables,
  RequestStepRespondPermissionFilter,
  RequestStepStatusFilter,
  RequestStepSummaryFragment,
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

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GetRequestStepsDocument);

  const newCursor = data?.getRequestSteps.length
    ? data.getRequestSteps[data.getRequestSteps.length - 1].requestStepId
    : "";

  const queryVarsRef = useRef<GetRequestStepsQueryVariables>({
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
  const requestSteps = (data?.getRequestSteps ?? []) as RequestStepSummaryFragment[];

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

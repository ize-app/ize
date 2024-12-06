import { useLazyQuery } from "@apollo/client";
import { debounce } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  GetRequestsDocument,
  GetRequestsQueryVariables,
  RequestSummaryFragment,
} from "@/graphql/generated/graphql";

const useRequestStepsSearch = ({
  userOnly,
  groupId,
  flowId,
  queryResultLimit,
}: {
  userOnly: boolean;
  groupId?: string;
  flowId?: string;
  queryResultLimit: number;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const [hasRespondPermission, setHasRespondPermission] = useState<boolean>(false);
  const [watchedByUser, setWatchedByUser] = useState<boolean>(userOnly);
  const [watchedByUserGroups, setWatchedByUserGroups] = useState<boolean>(userOnly);
  const [createdByUser, setCreatedByUser] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
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
    watchedByUser,
    watchedByUserGroups,
    createdByUser,
    open,
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
      watchedByUser,
      watchedByUserGroups,
      createdByUser,
      open,
      limit: queryResultLimit,
      cursor: undefined,
    };
    debouncedRefetch();
  }, [
    groupId,
    flowId,
    searchQuery,
    queryResultLimit,
    hasRespondPermission,
    watchedByUser,
    watchedByUserGroups,
    createdByUser,
    open,
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
    watchedByUser,
    watchedByUserGroups,
    createdByUser,
    open,
    selectedGroupId,
    setSearchQuery,
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
    loading,
    fetchMore,
    queryVars: queryVarsRef.current,
  };
};

export default useRequestStepsSearch;

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
  initialWatchedByUser,
  initialWatchedByUserGroups,
  initialHasTriggerPermissions,
  excludeGroupId,
}: {
  groupId?: string;
  queryResultLimit: number;
  initialWatchedByUser: boolean;
  initialWatchedByUserGroups: boolean;
  initialHasTriggerPermissions: boolean;
  excludeGroupId?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [createdByUser, setCreatedByUser] = useState<boolean>(false);
  const [watchedByUser, setWatchedByUser] = useState<boolean>(initialWatchedByUser);
  const [watchedByUserGroups, setWatchedByUserGroups] = useState<boolean>(
    initialWatchedByUserGroups,
  );
  const [hasTriggerPermissions, setHasTriggerPermission] = useState<boolean>(
    initialHasTriggerPermissions,
  );
  const [selectedGroupId, setGroupId] = useState<string | undefined>(groupId);
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GetFlowsDocument, {
    // fetchPolicy: "network-only",
  });

  const newCursor = data?.getFlows.length ? data.getFlows[data.getFlows.length - 1].flowId : "";

  const queryVarsRef = useRef<GetFlowsQueryVariables>({
    groupId: selectedGroupId,
    createdByUser,
    searchQuery,
    watchedByUser,
    watchedByUserGroups,
    hasTriggerPermissions,
    excludeGroupId,
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
      groupId: selectedGroupId,
      searchQuery,
      watchedByUser,
      watchedByUserGroups,
      hasTriggerPermissions,
      createdByUser,
      excludeGroupId,
      limit: queryResultLimit,
      cursor: undefined,
    };
    debouncedRefetch();
  }, [
    selectedGroupId,
    searchQuery,
    queryResultLimit,
    createdByUser,
    watchedByUser,
    watchedByUserGroups,
    hasTriggerPermissions,
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
  const flows = (data?.getFlows ?? []) as FlowSummaryFragment[];

  return {
    searchQuery,
    setSearchQuery,
    watchedByUser,
    watchedByUserGroups,
    hasTriggerPermissions,
    selectedGroupId,
    setGroupId,
    setWatchedByUser,
    setWatchedByUserGroups,
    setHasTriggerPermission,
    setOldCursor,
    createdByUser,
    setCreatedByUser,
    oldCursor,
    newCursor,
    flows,
    loading,
    fetchMore,
    queryVars: queryVarsRef.current,
  };
};

export default useFlowsSearch;

import {
  GetRequestStepsDocument,
  GetRequestStepsQueryVariables,
  RequestStepSummaryFragment,
} from "@/graphql/generated/graphql";
import Box from "@mui/material/Box";
import { useLazyQuery } from "@apollo/client";
import { ChangeEvent, useEffect, useState } from "react";

import CreateButton from "@/components/Menu/CreateButton";
import Loading from "@/components/Loading";
import Search from "@/components/Tables/Search";
import { RequestStepsTable } from "./RequestStepsTable";
import { Button, debounce } from "@mui/material";

export const RequestStepsSearch = ({
  userOnly,
  flowId,
}: {
  userOnly: boolean;
  flowId?: string;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [oldCursor, setOldCursor] = useState<string | undefined>(undefined);
  const queryResultLimit = 20;

  const queryVars: GetRequestStepsQueryVariables = {
    userOnly,
    flowId,
    searchQuery,
    limit: queryResultLimit,
  };

  // const [statusToggle, setStatusToggle] = useState<"open" | "closed">("open");

  const [getResults, { loading, data, fetchMore }] = useLazyQuery(GetRequestStepsDocument);

  const debouncedRefetch = debounce(() => {
    getResults({ variables: queryVars });
  }, 1000);

  useEffect(() => {
    debouncedRefetch();
  }, [searchQuery]);

  useEffect(() => {
    getResults({ variables: queryVars });
  }, []);

  const newCursor = data?.getRequestSteps.length
    ? data.getRequestSteps[data.getRequestSteps.length - 1].id
    : "";
  const requestSteps = (data?.getRequestSteps ?? []) as RequestStepSummaryFragment[];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          gap: "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <Search
            searchQuery={searchQuery}
            changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(event.target.value);
            }}
          />

          {/* <StatusToggle status={statusToggle} setStatus={setStatusToggle} /> */}
        </Box>
        <CreateButton />
      </Box>
      {loading ? <Loading /> : <RequestStepsTable requestSteps={requestSteps} />}
      {/* if there are no new results or no results at all, then hide the "load more" button */}
      {oldCursor !== newCursor && (data?.getRequestSteps.length ?? 0) >= queryResultLimit && (
        <Button
          onClick={() => {
            setOldCursor(newCursor);
            return fetchMore({
              variables: {
                ...queryVars,
                cursor: newCursor,
              },
            });
          }}
        >
          Load more
        </Button>
      )}
    </Box>
  );
};

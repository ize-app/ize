import Typography from "@mui/material/Typography";
import PageContainer from "@/layout/PageContainer";
import { GetRequestStepsDocument, RequestStepSummaryFragment } from "@/graphql/generated/graphql";
import Box from "@mui/material/Box";
import { useLazyQuery } from "@apollo/client";
import { ChangeEvent, useEffect, useState } from "react";

import CreateButton from "@/components/Menu/CreateButton";
import Loading from "@/components/Loading";
import Search from "@/components/Tables/Search";
import { RequestStepsTable } from "./RequestsTable";

import { debounce } from "lodash";

export const Requests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // const [statusToggle, setStatusToggle] = useState<"open" | "closed">("open");

  const [getResults, { loading, data }] = useLazyQuery(GetRequestStepsDocument);

  const debouncedRefetch = debounce(() => {
    getResults({ variables: { userOnly: true, flowId: null, searchQuery } });
  }, 1000);

  useEffect(() => {
    debouncedRefetch();
  }, [searchQuery, debouncedRefetch]);

  useEffect(() => {
    getResults({ variables: { userOnly: true, flowId: null, searchQuery } });
  }, [getResults]);

  const requestSteps = (data?.getRequestSteps ?? []) as RequestStepSummaryFragment[];

  return (
    <PageContainer>
      <Typography variant="h1">Requests</Typography>
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
      </Box>
    </PageContainer>
  );
};

import Typography from "@mui/material/Typography";
import PageContainer from "@/layout/PageContainer";
import { GetRequestStepsDocument, RequestStepSummaryFragment } from "@/graphql/generated/graphql";
import Box from "@mui/material/Box";
import { useQuery } from "@apollo/client";
import { ChangeEvent, useState } from "react";

import CreateButton from "@/components/Menu/CreateButton";
import Loading from "@/components/Loading";
import Search from "@/components/Tables/Search";
import { RequestStepsTable } from "./RequestsTable";
import { filterRequests } from "./requestsSearch";

export const Requests = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading } = useQuery(GetRequestStepsDocument); // { fetchPolicy: "network-only" }

  const requestSteps = (data?.getRequestSteps ?? []) as RequestStepSummaryFragment[];

  // const filteredFlows = filterFlows({ flows: requestSteps, searchQuery });
  const filteredRequestSteps = filterRequests({ requestSteps, searchQuery });

  return (
    <PageContainer>
      <Typography variant="h1">Requests</Typography>
      {loading ? (
        <Loading />
      ) : (
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
            </Box>
            <CreateButton />
          </Box>
          <RequestStepsTable requestSteps={filteredRequestSteps} />
        </Box>
      )}
    </PageContainer>
  );
};

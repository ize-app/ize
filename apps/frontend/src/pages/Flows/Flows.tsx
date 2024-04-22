import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FlowSummaryFragment, GetFlowsDocument } from "@/graphql/generated/graphql";
import { useQuery } from "@apollo/client";
import { ChangeEvent, useState } from "react";

import PageContainer from "@/layout/PageContainer";
import CreateButton from "@/components/Menu/CreateButton";
import Loading from "@/components/Loading";
import Search from "@/components/Tables/Search";
import { FlowsTable } from "./flowsTable";
import { filterFlows } from "./flowSearch";

export const Flows = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading } = useQuery(GetFlowsDocument); // { fetchPolicy: "network-only" }

  const flows = (data?.getFlows ?? []) as FlowSummaryFragment[];

  const filteredFlows = filterFlows({ flows, searchQuery });
  return (
    <PageContainer>
      <Typography variant="h1">Flows</Typography>
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
          <FlowsTable flows={filteredFlows} />
        </Box>
      )}
    </PageContainer>
  );
};

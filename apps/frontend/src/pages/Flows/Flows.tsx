import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "@/components/Loading";
import CreateButton from "@/components/Menu/CreateButton";
import { EmptyTablePlaceholder } from "@/components/Tables/EmptyTablePlaceholder.tsx";
import Search from "@/components/Tables/Search";
import { FlowSummaryFragment, GetFlowsDocument } from "@/graphql/generated/graphql";
import PageContainer from "@/layout/PageContainer";
import { Route } from "@/routers/routes.ts";

import { filterFlows } from "./flowSearch";
import { FlowsTable } from "./FlowsTable.tsx";

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
            height: "100%",
          }}
        >
          <>
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

            {flows.length > 0 ? (
              <FlowsTable flows={filteredFlows} />
            ) : (
              <EmptyTablePlaceholder>
                <Typography>
                  Looks like you don&apos;t have any flows set up yet. Learn more{" "}
                  <Link to={Route.NewFlow}>here</Link> or{" "}
                  <Link to={Route.NewFlow}>create your first flow</Link>. <br />
                  <br />
                  <span style={{ fontWeight: 500 }}>Flows</span> define and automate how a set of
                  people (Discord roles, NFTs, email addresses, etc) collectively take an action
                  together. For example, a flow could define how to:
                  <ul>
                    <li>
                      Ask for a group&apos;s opinions and use AI to create a summary of the hivemind
                    </li>
                    <li>
                      Vote on whether to give someone Discord @moderator permissions, and
                      automatically give assign that role if the vote passes
                    </li>
                    <li>
                      Solicit group ideas on initiatives, prioritize the ideas, and output results
                      to Airtable.
                    </li>
                  </ul>
                  <br />
                </Typography>
              </EmptyTablePlaceholder>
            )}
          </>
        </Box>
      )}
    </PageContainer>
  );
};

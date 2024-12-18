import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import TabPanel from "@/components/Tables/TabPanel";
import { TabProps, Tabs } from "@/components/Tables/Tabs";
import { FlowWatchFilter, RequestStatusFilter } from "@/graphql/generated/graphql";
import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";

import { GroupInvitesInfo } from "./GroupInvitesInfo";
import { NewUserTodoList } from "./NewUserTodoList";
import { RequestSearch } from "./RequestsSearch";

export const Requests = () => {
  const [currentTabIndex, setTabIndex] = useState(0);
  const tabs: TabProps[] = [
    {
      title: "In progress",
      content: (
        <RequestSearch
          initialFlowWatchFilter={FlowWatchFilter.WatchedByMeOrMyGroups}
          initialNeedsResponseFilter={false}
          initialRequestStatusFilter={RequestStatusFilter.Open}
          showNeedsResponseFilter={true}
          showRequestStatusFilter={false}
        />
      ),
    },
    {
      title: "Final results",
      content: (
        <RequestSearch
          initialFlowWatchFilter={FlowWatchFilter.WatchedByMeOrMyGroups}
          initialNeedsResponseFilter={false}
          initialRequestStatusFilter={RequestStatusFilter.Final}
          showNeedsResponseFilter={false}
          showRequestStatusFilter={false}
        />
      ),
    },
  ];
  return (
    <PageContainer>
      <Head
        title={"Dashboard"}
        description={"View and trigger requests for your collaborative workflows."}
      />
      <Typography variant="h1">Home</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <NewUserTodoList />
        <GroupInvitesInfo />
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Tabs
            tabs={tabs}
            currentTabIndex={currentTabIndex}
            handleChange={(_event: React.SyntheticEvent, newValue: number) => {
              setTabIndex(newValue);
            }}
          />
          {tabs.map((tab: TabProps, index) => (
            <TabPanel value={currentTabIndex} index={index} key={index}>
              {tab.content}
            </TabPanel>
          ))}
        </Box>
      </Box>
    </PageContainer>
  );
};

import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { GroupInvitations } from "@/components/GroupInvitations/GroupInivitations";
import { InfoBannersContainer } from "@/components/InfoBanner/InfoBannersContainer";
import TabPanel from "@/components/Tables/TabPanel";
import { TabProps, Tabs } from "@/components/Tables/Tabs";
import { FlowWatchFilter, RequestStatusFilter } from "@/graphql/generated/graphql";
import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";

import { RequestSearch } from "./RequestsSearch";

export const Requests = () => {
  const tabs: TabProps[] = [
    {
      title: "Active",
      content: (
        <RequestSearch
          initialFlowWatchFilter={FlowWatchFilter.WatchedByMeOrMyGroups}
          initialNeedsResponseFilter={true}
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
  const [currentTabIndex, setTabIndex] = useState(0);
  return (
    <PageContainer>
      <Head
        title={"Dashboard"}
        description={"View and trigger requests for your collaborative workflows."}
      />
      <Typography variant="h1">Inbox</Typography>
      <InfoBannersContainer>
        <GroupInvitations />
      </InfoBannersContainer>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
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
    </PageContainer>
  );
};

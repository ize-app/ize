import { useQuery } from "@apollo/client";
import { useState } from "react";

import {
  GroupSummaryPartsFragment,
  GroupsDocument,
  ProcessSummaryPartsFragment,
  ProcessesDocument,
  RequestSummaryPartsFragment,
  RequestsForCurrentUserDocument,
} from "../../graphql/generated/graphql";
import PageContainer from "../../layout/PageContainer";
import GroupTab from "../shared/Tables/GroupsTable/GroupTab";
import ProcessTab from "../shared/Tables/ProcessesTable/ProcessTab";
import RequestTab from "../shared/Tables/RequestsTable/RequestTab";
import TabPanel from "../shared/Tables/TabPanel";
import { TabProps, Tabs } from "../shared/Tables/Tabs";

const Dashboard = () => {
  const [currentTabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const { data: groupsData, loading: groupsLoading } = useQuery(GroupsDocument);

  const groups = (groupsData?.groupsForCurrentUser ??
    []) as GroupSummaryPartsFragment[];

  const { data: processData, loading: processLoading } = useQuery(
    ProcessesDocument,
    {
      variables: {
        groups: groups.map((group) => group.id),
      },
    },
  );

  const { data: requestData, loading: requestLoading } = useQuery(
    RequestsForCurrentUserDocument,
    {
      variables: {
        groups: groups.map((group) => group.id),
      },
    },
  );

  const processes = (processData?.processesForCurrentUser ??
    []) as ProcessSummaryPartsFragment[];

  const requests = (requestData?.requestsForCurrentUser ??
    []) as RequestSummaryPartsFragment[];

  const tabs = [
    {
      title: "Requests",
      content: <RequestTab requests={requests} loading={requestLoading} />,
    },
    {
      title: "Process",
      content: <ProcessTab processes={processes} loading={processLoading} />,
    },
    {
      title: "Groups",
      content: <GroupTab groups={groups} loading={groupsLoading} />,
    },
  ];

  return (
    <PageContainer>
      <Tabs
        tabs={tabs}
        currentTabIndex={currentTabIndex}
        handleChange={handleChange}
      />
      {tabs.map((tab: TabProps, index) => (
        <TabPanel value={currentTabIndex} index={index} key={index}>
          {tab.content}
        </TabPanel>
      ))}
    </PageContainer>
  );
};

export default Dashboard;

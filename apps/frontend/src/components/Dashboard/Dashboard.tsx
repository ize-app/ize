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
import { CurrentUserContext } from "../../contexts/current_user_context";
import { useContext } from "react";

const Dashboard = () => {
  const { me } = useContext(CurrentUserContext);
  const [currentTabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const { data: groupsData, loading: groupsLoading } = useQuery(GroupsDocument, {
    skip: !me,
  });

  const { data: processData, loading: processLoading } = useQuery(ProcessesDocument, {
    skip: !me,
  });

  const { data: requestData, loading: requestLoading } = useQuery(RequestsForCurrentUserDocument, {
    skip: !me,
  });

  const groups = (groupsData?.groupsForCurrentUser ?? []) as GroupSummaryPartsFragment[];

  const processes = (processData?.processesForCurrentUser ?? []) as ProcessSummaryPartsFragment[];

  const requests = (requestData?.requestsForCurrentUser ?? []) as RequestSummaryPartsFragment[];

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
      <Tabs tabs={tabs} currentTabIndex={currentTabIndex} handleChange={handleChange} />
      {tabs.map((tab: TabProps, index) => (
        <TabPanel value={currentTabIndex} index={index} key={index}>
          {tab.content}
        </TabPanel>
      ))}
    </PageContainer>
  );
};

export default Dashboard;

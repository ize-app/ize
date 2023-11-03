import { useQuery } from "@apollo/client";
import { useState } from "react";

import {
  ProcessSummaryPartsFragment,
  ProcessesDocument,
  RequestSummaryPartsFragment,
  RequestsForCurrentUserDocument,
} from "../../graphql/generated/graphql";
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

  const { data: processData, loading: processLoading } =
    useQuery(ProcessesDocument);

  const { data: requestData, loading: requestLoading } = useQuery(
    RequestsForCurrentUserDocument,
  );

  const processes = (processData?.processesForCurrentUser ??
    []) as ProcessSummaryPartsFragment[];

  const requests = (requestData?.requestsForCurrentUser ??
    []) as RequestSummaryPartsFragment[];


  const tabs = [
    { title: "Requests", content: <RequestTab requests={requests} /> },
    {
      title: "Process",
      content: <ProcessTab processes={processes} loading={processLoading} />,
    },
    { title: "Groups", content: <GroupTab /> },
  ];

  return (
    <>
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
    </>
  );
};

export default Dashboard;

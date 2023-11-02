import { useQuery } from "@apollo/client";
import { useState } from "react";

import {
  ProcessSummaryPartsFragment,
  ProcessesDocument,
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

  const { data, loading } = useQuery(ProcessesDocument);

  const processes = (data?.processesForCurrentUser ??
    []) as ProcessSummaryPartsFragment[];

  const tabs = [
    { title: "Requests", content: <RequestTab /> },
    {
      title: "Process",
      content: <ProcessTab processes={processes} loading={loading} />,
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

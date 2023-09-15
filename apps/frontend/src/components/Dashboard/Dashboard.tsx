import { useState } from "react";
import { Tabs, TabProps } from "./Tabs";
import Table from "./Table";
import TabPanel from "./TabPanel";

const RequestTab = () => {
  return (
    <>
      <Table />
    </>
  );
};

const tabs = [
  { title: "Requests", content: <RequestTab /> },
  { title: "Process", content: <div>Process</div> },
  { title: "Groups", content: <div>Groups</div> },
];

const Dashboard = () => {
  const [currentTabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Tabs
        tabs={tabs}
        currentTabIndex={currentTabIndex}
        handleChange={handleChange}
      />
      {tabs.map((tab: TabProps, index) => (
        <TabPanel value={currentTabIndex} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </>
  );
};

export default Dashboard;

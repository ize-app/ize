import { useState } from "react";
import { Tabs, TabProps } from "./Tabs";
import GroupTab from "./GroupTab";
import ProcessTab from "./ProcessTab";
import RequestTab from "./RequestTab";
import TabPanel from "./TabPanel";

const tabs = [
  { title: "Requests", content: <RequestTab /> },
  { title: "Process", content: <ProcessTab /> },
  { title: "Groups", content: <GroupTab /> },
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
        <TabPanel value={currentTabIndex} index={index} key={index}>
          {tab.content}
        </TabPanel>
      ))}
    </>
  );
};

export default Dashboard;

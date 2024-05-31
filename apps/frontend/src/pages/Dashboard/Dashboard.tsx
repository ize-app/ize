import { useState } from "react";

import CreateButton from "../../components/Menu/CreateButton";
import TabPanel from "../../components/Tables/TabPanel";
import { TabProps, Tabs } from "../../components/Tables/Tabs";
import PageContainer from "../../layout/PageContainer";
const Dashboard = () => {
  const [currentTabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const tabs: TabProps[] = [];

  return (
    <PageContainer>
      <CreateButton />
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

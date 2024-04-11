import { useState } from "react";

import PageContainer from "../../layout/PageContainer";
import TabPanel from "../../components/Tables/TabPanel";
import { TabProps, Tabs } from "../../components/Tables/Tabs";
// import { CurrentUserContext } from "../../contexts/current_user_context";
// import { useContext } from "react";
import CreateButton from "../../components/Menu/CreateButton";

const Dashboard = () => {
  // const { me } = useContext(CurrentUserContext);
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

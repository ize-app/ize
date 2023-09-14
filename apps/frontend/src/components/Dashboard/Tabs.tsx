import * as React from "react";
import { Tabs as MuiTabs, Tab, Box } from "@mui/material";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export interface TabProps {
  title: string;
  content: JSX.Element;
}

export interface TabsProps {
  tabs: TabProps[];
  currentTabIndex: number;
  handleChange: (_event: React.SyntheticEvent, newValue: number) => void;
}

export const Tabs = ({
  tabs,
  currentTabIndex,
  handleChange,
}: TabsProps): JSX.Element => {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <MuiTabs
          value={currentTabIndex}
          onChange={handleChange}
          aria-label="tabs"
        >
          {tabs.map((tab: TabProps, index) => {
            return <Tab label={tab.title} {...a11yProps(index)} />;
          })}
        </MuiTabs>
      </Box>
    </Box>
  );
};

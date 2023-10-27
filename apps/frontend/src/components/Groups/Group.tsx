import { useQuery } from "@apollo/client";
import Groups from "@mui/icons-material/Groups";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useParams } from "react-router-dom";

import BannerWithAvatar from "./BannerWithAvatar";
import {
  GroupDocument,
  GroupSummaryPartsFragment,
} from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import { shortUUIDToFull } from "../../utils/inputs";
import ProcessTab from "../shared/Tables/ProcessesTable/ProcessTab";
import RequestTab from "../shared/Tables/RequestsTable/RequestTab";
import TabPanel from "../shared/Tables/TabPanel";
import { TabProps, Tabs } from "../shared/Tables/Tabs";

const tabs = [
  { title: "Requests", content: <RequestTab /> },
  { title: "Process", content: <ProcessTab /> },
];

export const Group = () => {
  const { groupId: groupIdShort } = useParams();
  const groupId = shortUUIDToFull(groupIdShort as string);

  const { data, loading, error } = useQuery(GroupDocument, {
    variables: {
      id: groupId,
    },
  });
  
  const group = data?.group as GroupSummaryPartsFragment;

  // be8f71a5-4e73-49b6-a6fe-32c6f00b7bb3
  // pwNXPJX1qV5Z3fBAPQxWrZ

  // 2PSykC1knZWg6Pqtkgia6R
  // 0ec840c7-f906-4470-8b2b-2af9ca74a4cf
  const [currentTabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return group ? (
    <>
      <Head
        title={group.name}
        description={`Where ${group.name} makes decisions and evolves their process`}
      />
      <Box>
        <BannerWithAvatar
          bannerUrl={"/test-banner.webp"}
          avatarUrl={group.icon ?? ""}
          name={group.name}
          parent={{
            name: group?.organization?.name,
            avatarUrl: group?.organization?.icon,
          }}
        />
        <Box
          sx={{
            paddingLeft: "1.2rem",
          }}
        >
          <Typography variant="h1">{group.name}</Typography>
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  height: "1rem",
                  width: "auto",
                }}
                component="img"
                src="/discord-logo.png"
              />
              <Typography
                variant="body1"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: "1",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Discord role
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "8px" }}>
              <Groups color={"primary"} />
              <Typography>{group.memberCount}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
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
  ) : (
    <div>test</div>
  );
};

import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useQuery } from "@apollo/client";
import { Groups } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import BannerWithAvatar from "./BannerWithAvatar";
import { GroupDocument } from "../../graphql/generated/graphql";
import { Tabs, TabProps } from "../shared/Tables/Tabs";
import TabPanel from "../shared/Tables/TabPanel";
import ProcessTab from "../shared/Tables/ProcessesTable/ProcessTab";
import RequestTab from "../shared/Tables/RequestsTable/RequestTab";

import { groupMockData } from "../shared/Tables/mockData";

const tabs = [
  { title: "Requests", content: <RequestTab /> },
  { title: "Process", content: <ProcessTab /> },
];

export const Group = () => {
  const { groupId } = useParams();

  const { data } = useQuery(GroupDocument, {
    variables: {
      id: groupId ?? "",
    },
  });

  const groupData = groupMockData[1];

  const [currentTabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Box>
        <BannerWithAvatar
          bannerUrl={groupData.bannerUrl}
          avatarUrl={groupData.avatarUrl}
          name={groupData.name ? groupData.name : ""}
          parent={
            groupData.parentGroup
              ? {
                  name: groupData.parentGroup.name,
                  avatarUrl: groupData.parentGroup.avatarUrl,
                }
              : undefined
          }
        />
        <Box
          sx={{
            paddingLeft: "1.2rem",
          }}
        >
          <Typography variant="h1">{groupData.name}</Typography>
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
                {groupData.type === "Discord server" ? (
                  "Server"
                ) : groupData.parentGroup ? (
                  <>
                    role of{" "}
                    <Link to={"/groups/" + groupData.parentGroup.groupId}>
                      {groupData.parentGroup.name}
                    </Link>
                  </>
                ) : (
                  "Discord role"
                )}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "8px" }}>
              <Groups color={"primary"} />
              <Typography>{groupData.memberCount}</Typography>
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
  );
};

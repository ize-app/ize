import { useState } from "react";
import { useParams } from "react-router-dom";

import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import BannerWithAvatar from "./BannerWithAvatar";
import { GroupDocument } from "../../graphql/generated/graphql";
import { Tabs, TabProps } from "../shared/Tables/Tabs";
import TabPanel from "../shared/Tables/TabPanel";
import ProcessTab from "../shared/Tables/ProcessesTable/ProcessTab";
import RequestTab from "../shared/Tables/RequestsTable/RequestTab";

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

  const [currentTabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Box>
        <BannerWithAvatar
          bannerUrl="/test-banner.webp"
          avatarUrl=""
          name={data?.group?.name ? data?.group?.name : ""}
          parent={{
            name: "Token Engineering Commons",
            avatarUrl:
              "https://yt3.googleusercontent.com/ytc/AOPolaSkSJ6dSSdglPQ45Z6t7PuxR0r7elOmaKnS6_aP=s176-c-k-c0x00ffffff-no-rj",
          }}
        />
        <Box
          sx={{
            paddingLeft: "1rem",
            paddingTop: "1rem",
          }}
        >
          <Typography>{data?.group?.name}</Typography>
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

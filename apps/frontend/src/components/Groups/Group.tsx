import { useQuery } from "@apollo/client";
import Groups from "@mui/icons-material/Groups";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BannerWithAvatar from "./BannerWithAvatar";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import {
  GroupDocument,
  GroupSummaryPartsFragment,
} from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import { colors } from "../../style/style";
import { shortUUIDToFull } from "../../utils/inputs";
import Loading from "../shared/Loading";
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
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const navigate = useNavigate();

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

  const onError = () => {
    navigate("/");
    setSnackbarOpen(true);
    setSnackbarData({ message: "Invalid group", type: "error" });
  };

  return error ? (
    onError()
  ) : loading || !group ? (
    <Loading />
  ) : (
    <>
      <Head
        title={group.name}
        description={`Where ${group.name} makes decisions and evolves their process`}
      />
      <Box>
        <BannerWithAvatar
          bannerUrl={""}
          avatarUrl={group.icon ?? ""}
          name={group.name}
          color={group.color}
          parent={
            group.name !== "@everyone"
              ? {
                  name: group?.organization?.name,
                  avatarUrl: group?.organization?.icon,
                }
              : undefined
          }
        />
        <Box
          sx={{
            paddingLeft: "1.5rem",
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
                Discord role of{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: "bold", color: colors.primary }}
                >
                  {group.discordRoleGroup.discordServer.name}
                </Box>
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
  );
};

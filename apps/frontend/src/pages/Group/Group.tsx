import { useQuery } from "@apollo/client";
import { CheckCircleOutline } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { WatchGroupButton } from "@/components/group/WatchGroupButton/WatchGroupButton";

import BannerWithAvatar from "./BannerWithAvatar";
import { MembersList } from "./MembersList";
import Loading from "../../components/Loading";
import TabPanel from "../../components/Tables/TabPanel";
import { TabProps, Tabs } from "../../components/Tables/Tabs";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { GroupDocument, IzeGroupFragment } from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { shortUUIDToFull } from "../../utils/inputs";
import { FlowsSearch } from "../Flows/FlowsSearch";
import { RequestStepsSearch } from "../Requests/RequestStepsSearch";

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

  const group = data?.group as IzeGroupFragment;

  const [currentTabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const onError = () => {
    navigate("/");
    setSnackbarOpen(true);
    setSnackbarData({ message: "Cannot find this group", type: "error" });
  };

  if (error) onError();

  const tabs: TabProps[] = [
    {
      title: "Requests",
      content: !loading ? <RequestStepsSearch userOnly={false} groupId={groupId} /> : null,
    },
    {
      title: "Flows",
      content: !loading ? <FlowsSearch groupId={groupId} /> : null,
    },
  ];

  return loading || !group ? (
    <Loading />
  ) : (
    <>
      <Head
        title={group.group.name}
        description={`Where ${group.group.name} makes decisions and evolves their process`}
      />
      <BannerWithAvatar
        bannerUrl={""}
        avatarUrl={group.group.icon ?? ""}
        name={group.group.name}
        color={group.group.color}
        parent={
          group.group.organization
            ? {
                name: group.group.organization?.name,
                avatarUrl: group.group.organization?.icon,
              }
            : undefined
        }
        id={group.group.id}
      />
      <PageContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Typography variant="h1">{group.group.name}</Typography>

            <WatchGroupButton
              watched={group.group.isWatched}
              groupId={group.group.id}
              size="medium"
            />
          </Box>
          <Box
            sx={(theme) => ({
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
              [theme.breakpoints.down("sm")]: {
                flexDirection: "column",
              },
            })}
          >
            <MembersList members={group.members} />
            {group.group.isMember && (
              <Box sx={{ display: "flex", gap: "8px" }}>
                <CheckCircleOutline color="primary" fontSize="small" />
                <Typography variant="description" color="primary">
                  You are a member
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Tabs
          tabs={tabs}
          currentTabIndex={currentTabIndex}
          handleChange={handleChange}
          sx={{ marginTop: "24px" }}
        />
        {tabs.map((tab: TabProps, index) => (
          <TabPanel value={currentTabIndex} index={index} key={index}>
            {tab.content}
          </TabPanel>
        ))}
      </PageContainer>
    </>
  );
};

import { useQuery } from "@apollo/client";
import { CheckCircleOutline } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";
import { Tooltip, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";

import { WatchGroupButton } from "@/components/watchButton/WatchGroupButton";
import { Route } from "@/routers/routes";

import BannerWithAvatar from "./BannerWithAvatar";
import { EvolveGroupButton } from "./EvolveGroupButton";
import { MembersList } from "./MembersList";
import Loading from "../../components/Loading";
import TabPanel from "../../components/Tables/TabPanel";
import { TabProps, Tabs } from "../../components/Tables/Tabs";
import {
  FlowWatchFilter,
  GroupDocument,
  IzeGroupFragment,
  RequestStatusFilter,
} from "../../graphql/generated/graphql";
import { SnackbarContext } from "../../hooks/contexts/SnackbarContext";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { fullUUIDToShort, shortUUIDToFull } from "../../utils/inputs";
import { FlowsSearch } from "../Flows/FlowsSearch";
import { RequestSearch } from "../Requests/RequestsSearch";

export const Group = () => {
  const { groupId: groupIdShort } = useParams();
  const groupId = shortUUIDToFull(groupIdShort as string);
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, loading, error } = useQuery(GroupDocument, {
    variables: {
      id: groupId,
    },
  });

  const group = data?.group as IzeGroupFragment;
  // console.log("group", group);

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
      title: "Activity",
      content: !loading ? (
        <RequestSearch
          initialFlowWatchFilter={FlowWatchFilter.All}
          groupId={groupId}
          initialNeedsResponseFilter={false}
          showNeedsResponseFilter={true}
          showRequestStatusFilter={true}
          initialRequestStatusFilter={RequestStatusFilter.Open}
        />
      ) : null,
    },
    {
      title: "Flow templates",
      icon: (
        <Tooltip
          title="Every group has watched flow templates. These are flows that the group has
              collectively decided it wants to highlight and receive notifications for"
          arrow
        >
          <InfoIcon fontSize="small" />
        </Tooltip>
      ),
      content: !loading ? (
        <FlowsSearch
          groupId={groupId}
          onClickRow={(flow) => {
            navigate(
              generatePath(Route.Flow, {
                flowId: fullUUIDToShort(flow.flowId),
                flowVersionId: null,
              }),
            );
          }}
        />
      ) : null,
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Typography variant="h1">{group.group.name}</Typography>
              <WatchGroupButton watched={group.isWatched} groupId={group.group.id} size="medium" />
            </Box>

            {!isSmallScreenSize && (
              <EvolveGroupButton evolveGroupFlowId={group.evolveGroupFlowId} />
            )}
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

            {group.isMember && (
              <Box sx={{ display: "flex", gap: "8px" }}>
                <CheckCircleOutline color="primary" fontSize="small" />
                <Typography variant="description" color="primary">
                  You are a member
                </Typography>
              </Box>
            )}
          </Box>
          {group.notificationEntity && (
            <Typography variant="description" lineHeight={"24px"}>
              Sends notifications to{" "}
              <span style={{ fontWeight: "500" }}>{group.notificationEntity.name}</span> Telegram
              group
            </Typography>
          )}
          {group.description && (
            <Typography variant="description" marginTop="8px">
              {group.description}
            </Typography>
          )}
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

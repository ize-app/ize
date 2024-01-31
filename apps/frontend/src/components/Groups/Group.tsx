import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BannerWithAvatar from "./BannerWithAvatar";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import {
  GroupDocument,
  GroupSummaryPartsFragment,
  ProcessSummaryPartsFragment,
  ProcessesForGroupDocument,
  RequestSummaryPartsFragment,
  RequestsForGroupDocument,
} from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { shortUUIDToFull } from "../../utils/inputs";
import Loading from "../shared/Loading";
import ProcessTab from "../shared/Tables/ProcessesTable/ProcessTab";
import RequestTab from "../shared/Tables/RequestsTable/RequestTab";
import TabPanel from "../shared/Tables/TabPanel";
import { TabProps, Tabs } from "../shared/Tables/Tabs";

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

  const { data: processData, loading: processLoading } = useQuery(ProcessesForGroupDocument, {
    variables: { groupId: groupId },
  });

  const processes = (processData?.processesForGroup ?? []) as ProcessSummaryPartsFragment[];

  const { data: requestData, loading: requestLoading } = useQuery(RequestsForGroupDocument, {
    variables: {
      groupId: groupId,
    },
  });

  const requests = (requestData?.requestsForGroup ?? []) as RequestSummaryPartsFragment[];

  const group = data?.group as GroupSummaryPartsFragment;

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

  const tabs = [
    {
      title: "Requests",
      content: <RequestTab requests={requests} loading={requestLoading} />,
    },
    {
      title: "Process",
      content: <ProcessTab processes={processes} loading={processLoading} />,
    },
  ];

  return loading || !group ? (
    <Loading />
  ) : (
    <>
      <Head
        title={group.name}
        description={`Where ${group.name} makes decisions and evolves their process`}
      />
      <BannerWithAvatar
        bannerUrl={""}
        avatarUrl={group.icon ?? ""}
        name={group.name}
        color={group.color}
        parent={
          group?.organization
            ? {
                name: group?.organization?.name,
                avatarUrl: group?.organization?.icon,
              }
            : undefined
        }
        id={group.id}
      />
      <PageContainer>
        <Box
          sx={
            {
              // paddingLeft: "1.5rem",
            }
          }
        >
          <Typography variant="h1">{group.name}</Typography>
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          ></Box>
        </Box>
        <Tabs tabs={tabs} currentTabIndex={currentTabIndex} handleChange={handleChange} />
        {tabs.map((tab: TabProps, index) => (
          <TabPanel value={currentTabIndex} index={index} key={index}>
            {tab.content}
          </TabPanel>
        ))}
      </PageContainer>
    </>
  );
};

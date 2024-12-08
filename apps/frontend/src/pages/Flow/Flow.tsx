import { useQuery } from "@apollo/client";
import { Chip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { Link, generatePath, useNavigate, useParams } from "react-router-dom";

import { AvatarGroup } from "@/components/Avatar";
import { Breadcrumbs } from "@/components/BreadCrumbs";
import { ConfigDiagramFlow } from "@/components/ConfigDiagram";
import TabPanel from "@/components/Tables/TabPanel";
import { TabProps, Tabs } from "@/components/Tables/Tabs";
import { WatchFlowButton } from "@/components/watchButton/WatchFlowButton";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";
import {
  EvolveFlowRoute,
  NewRequestRoute,
  Route,
  evolveFlowRoute,
  newRequestRoute,
} from "@/routers/routes";

import Loading from "../../components/Loading";
import {
  FlowFragment,
  FlowType,
  FlowWatchFilter,
  GetFlowDocument,
} from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { fullUUIDToShort, shortUUIDToFull } from "../../utils/inputs";
import { RequestSearch } from "../Requests/RequestsSearch";

export const Flow = () => {
  const { me } = useContext(CurrentUserContext);
  const { flowId: flowIdShort, flowVersionId: flowVersionIdShort } = useParams();
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const [currentTabIndex, setTabIndex] = useState(0);

  const flowId: string | null = flowIdShort ? shortUUIDToFull(flowIdShort) : null;
  const flowVersionId: string | null = flowVersionIdShort
    ? shortUUIDToFull(flowVersionIdShort)
    : null;

  const navigate = useNavigate();

  const {
    data: flowData,
    loading: flowLoading,
    error: processError,
  } = useQuery(GetFlowDocument, {
    variables: {
      flowId,
      flowVersionId,
    },
  });

  const flow = flowData?.getFlow as FlowFragment;
  // console.log("flow", flow);

  const tabs: TabProps[] = [
    {
      title: "Flow",
      content: <ConfigDiagramFlow flow={flow} />,
    },
  ];

  if (flowLoading || !flow) return <Loading />;

  if (flow.evolve)
    tabs.push({
      title: "Evolve flow",
      content: <ConfigDiagramFlow flow={flow.evolve} />,
    });

  const isCurrentFlowVersion = flow.flowVersionId === flow.currentFlowVersionId;
  const isDraft = !flow.active && !flow.versionPublishedAt;
  const isOldVersion = !flow.active && flow.versionPublishedAt;
  const isEvolveFlow = flow.type === FlowType.Evolve;

  const onError = () => {
    navigate("/");
    setSnackbarOpen(true);
    setSnackbarData({ message: "Cannot find this flow", type: "error" });
  };

  if (processError) onError();

  const breadCrumbItems = [
    { title: "Flows", link: Route.Flows.toString() },
    {
      title: flow.name + (flow.group ? ` (${flow.group.name})` : ""),
      link: generatePath(Route.Flow, {
        flowId: fullUUIDToShort(flow.flowId),
        // Link to old version of flow if request is made from an older version
        flowVersionId:
          flow.flowVersionId !== flow.currentFlowVersionId
            ? fullUUIDToShort(flow.flowVersionId)
            : null,
      }),
    },
  ];

  return (
    <PageContainer>
      <Head title={flow.name} description={""} />
      <Breadcrumbs items={breadCrumbItems} />
      {/* manages top component, flow diagram, request search */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* top component */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            outline: "1px solid rgba(0, 0, 0, 0.1)",
            backgroundColor: "white",
            flexGrow: 1,
            padding: "12px",
            paddingBottom: "36px",
            // gap: "12px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Typography variant={"h1"} margin="8px 0px">
              {flow.name}
            </Typography>

            <WatchFlowButton watched={flow.watching.user} flowId={flow.id} size="medium" />
          </Box>
          {flow.group && (
            <Typography variant="description" lineHeight={"24px"}>
              Modifies{" "}
              <Link
                style={{ color: "inherit" }}
                to={generatePath(Route.Group, {
                  groupId: fullUUIDToShort(flow.group.id),
                })}
              >
                {flow.group.name}
              </Link>
            </Typography>
          )}
          {isDraft && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Box sx={{ display: "flex", gap: "8px" }}>
                <Chip label={"Draft"} size="small" />
                <Typography variant="description">
                  Version created on {new Date(flow.versionCreatedAt).toLocaleString()}
                </Typography>
              </Box>
              <Typography>
                This draft flow version has not been published. See the{" "}
                <Link
                  to={generatePath(Route.Flow, {
                    flowId: fullUUIDToShort(flow.flowId),
                    flowVersionId: null,
                  })}
                >
                  current published version of this flow.
                </Link>
              </Typography>
            </Box>
          )}
          {isCurrentFlowVersion && (
            <Box sx={{ display: "flex", gap: "8px" }}>
              {flow.versionPublishedAt && (
                <Typography variant="description" lineHeight={"24px"}>
                  Version published on{" "}
                  {new Date(flow.versionPublishedAt).toLocaleString(undefined, {
                    year: "numeric",
                    day: "numeric",
                    month: "long",
                  })}
                </Typography>
              )}
              <Chip label={"Active"} size="small" />
            </Box>
          )}
          {isOldVersion && (
            <Box>
              <Box sx={{ display: "flex", gap: "8px" }}>
                <Chip label={"Old version"} size="small" />
                {flow.versionPublishedAt && (
                  <Typography variant="description" lineHeight={"24px"}>
                    This version published on{" "}
                    {new Date(flow.versionPublishedAt).toLocaleString(undefined, {
                      year: "numeric",
                      day: "numeric",
                      month: "long",
                    })}
                  </Typography>
                )}
              </Box>
              <Typography variant="description" lineHeight={"24px"}>
                This is an old version of this flow. See the{" "}
                <Link
                  to={generatePath(Route.Flow, {
                    flowId: fullUUIDToShort(flow.flowId),
                    flowVersionId: null,
                  })}
                >
                  current published version of this flow.
                </Link>
              </Typography>
            </Box>
          )}
          {flow.watching.groups.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "6px",
                height: "24px",
              }}
            >
              <Typography variant="description" color="textSecondary">
                Watched by
              </Typography>
              <AvatarGroup avatars={flow.watching.groups} size={"20px"} />
            </Box>
          )}
          {/* Button row */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "16px",
              gap: "16px",
            }}
          >
            {isCurrentFlowVersion &&
              !isEvolveFlow &&
              // user is logged in
              !!me && (
                <>
                  <Button
                    variant="contained"
                    // disabled={!flow.steps[0]?.userPermission.request}
                    sx={{
                      width: "140px",
                      display: !me ? "none" : "flex",
                    }}
                    onClick={() =>
                      navigate(
                        generatePath(newRequestRoute(NewRequestRoute.CreateRequest), {
                          flowId: fullUUIDToShort(flow.flowId),
                        }),
                      )
                    }
                  >
                    Create request
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate(
                        generatePath(evolveFlowRoute(EvolveFlowRoute.Setup), {
                          flowId: fullUUIDToShort(flow.flowId),
                        }),
                      );
                    }}
                    // disabled={!flow.evolve?.steps[0]?.request}
                    sx={{
                      width: "140px",
                      display: !me ? "none" : "flex",
                    }}
                  >
                    Evolve flow
                  </Button>
                </>
              )}
            {isOldVersion && (
              <Button
                variant="contained"
                disabled={!flow.trigger.userPermission}
                sx={{
                  width: "300px",
                  display: !me ? "none" : "flex",
                }}
                onClick={() =>
                  navigate(
                    generatePath(Route.Flow, {
                      flowId: fullUUIDToShort(flow.flowId),
                      // defaults to current flow version
                      flowVersionId: null,
                    }),
                  )
                }
              >
                Go to current version of this flow
              </Button>
            )}
          </Box>
          {flow.flowsEvolvedByThisFlow.length > 0 && (
            <>
              <Typography>This flow is responsible for evolving: </Typography>
              <Box component="ul" sx={{ display: "flex", marginBlockStart: "0rem" }}>
                {flow.flowsEvolvedByThisFlow.map((evolvedFlow) => (
                  <Typography component="li" key={evolvedFlow.flowId}>
                    <Link
                      key={evolvedFlow.flowId}
                      to={generatePath(Route.Flow, {
                        flowId: fullUUIDToShort(evolvedFlow.flowId),
                        flowVersionId: null,
                      })}
                    >
                      {evolvedFlow.flowName}
                    </Link>
                  </Typography>
                ))}
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Tabs
            tabs={tabs}
            currentTabIndex={currentTabIndex}
            handleChange={(_event: React.SyntheticEvent, newValue: number) => {
              setTabIndex(newValue);
            }}
          />
          {tabs.map((tab: TabProps, index) => (
            <TabPanel value={currentTabIndex} index={index} key={index}>
              {tab.content}
            </TabPanel>
          ))}
        </Box>
        {isCurrentFlowVersion && (
          <RequestSearch
            initialFlowWatchFilter={FlowWatchFilter.All}
            flowId={flow.flowId}
            initialNeedsResponseFilter={false}
          />
        )}
      </Box>
    </PageContainer>
  );
};

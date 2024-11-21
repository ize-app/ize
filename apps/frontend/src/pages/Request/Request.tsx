import { useQuery } from "@apollo/client";
import { Breadcrumbs, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { Link, generatePath, useNavigate, useParams } from "react-router-dom";

import { AvatarWithName } from "@/components/Avatar";
import { ConfigDiagramRequest } from "@/components/ConfigDiagram/ConfigDiagramRequest/ConfigDiagramRequest";
import { EndRequestStepButton } from "@/components/EndRequestStepButton";
import { TriggerFieldSet } from "@/components/Field/TriggerFieldSet";
import { ResponseForm } from "@/components/Form/ResponseForm/ResponseForm";
import { RequestResults } from "@/components/result/Results/RequestResults";
import TabPanel from "@/components/Tables/TabPanel";
import { TabProps, Tabs } from "@/components/Tables/Tabs";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { Route } from "@/routers/routes";
import { colors } from "@/style/style";

import { Responses } from "./Responses";
import Loading from "../../components/Loading";
import { GetRequestDocument, ResponseFragment } from "../../graphql/generated/graphql";
import { SnackbarContext } from "../../hooks/contexts/SnackbarContext";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { fullUUIDToShort, shortUUIDToFull } from "../../utils/inputs";

export const SectionHeader = ({ title }: { title: string }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "40px",
        display: "flex",
        alignItems: "center",
        // outline: "1px solid rgba(0, 0, 0, 0.1)",
        padding: "1rem",
      }}
    >
      <Typography color="primary" variant="label">
        {title}
      </Typography>
    </Box>
  );
};

export const Request = () => {
  const { requestId: shortRequestId } = useParams();
  const requestId = shortUUIDToFull(shortRequestId as string);
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const { me } = useContext(CurrentUserContext);
  const theme = useTheme();
  const navigate = useNavigate();

  const [currentTabIndex, setTabIndex] = useState(0);

  let reusable = false;
  let acceptingNewResponses = false;
  let currRequestStepId: string = "";
  let userResponses: ResponseFragment[] | undefined = undefined;
  let allowMultipleResponses: boolean = false;
  let showManuallyEndStepButton: boolean = false;

  const { data, loading, error } = useQuery(GetRequestDocument, {
    variables: {
      requestId: requestId,
    },
  });

  const onError = () => {
    navigate("/");
    setSnackbarOpen(true);
    setSnackbarData({ message: "Cannot find this request", type: "error" });
  };

  if (error) onError();

  const request = data?.getRequest;

  if (request) {
    const currentStep = request.flow.steps[request?.currentStepIndex];
    const currentReqStep = request.requestSteps[request?.currentStepIndex];

    reusable = request.flow.reusable;
    acceptingNewResponses = !currentReqStep.status.responseFinal;
    userResponses = currentReqStep.userResponses;
    allowMultipleResponses = !!currentStep.response?.allowMultipleResponses;
    const userIsCreator =
      (me?.user.entityId === request?.creator.entityId ||
        me?.identities.some((i) => i.entityId === request?.creator.entityId)) ??
      false;
    showManuallyEndStepButton =
      (currentStep.response?.canBeManuallyEnded &&
        userIsCreator &&
        !currentReqStep?.status.responseFinal) ??
      false;
    currRequestStepId = currentReqStep.requestStepId;
  }

  console.log("request is ", request);

  if (loading || !request) return <Loading />;

  const tabs: TabProps[] = [
    {
      title: "Status",
      content: <ConfigDiagramRequest request={request} />,
    },
    {
      title: "Results",
      content: <RequestResults request={request} />,
    },
    {
      title: "Responses",
      content: <Responses request={request} />,
    },
  ];

  return (
    <PageContainer>
      <Head
        title={"Request for " + request.flow.name}
        description={"Request for " + request.flow.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb" sx={{ margin: "8px 0px" }}>
            <Typography sx={{ color: "text.primary" }}>Flows</Typography>

            {reusable && (
              <>
                <Link
                  to={generatePath(Route.Flow, {
                    flowId: fullUUIDToShort(request.flow.flowId),
                    // Link to old version of flow if request is made from an older version
                    flowVersionId:
                      request.flow.flowVersionId !== request?.flow.currentFlowVersionId
                        ? fullUUIDToShort(request.flow.flowVersionId)
                        : null,
                  })}
                >
                  {request.flow.name + (request.flow.group ? ` (${request.flow.group.name})` : "")}
                </Link>
              </>
            )}
            <Typography sx={{ color: "text.primary" }}>Request</Typography>
          </Breadcrumbs>
          <Box
            sx={{
              display: "flex",
              marginTop: "12px",
              justifyContent: "space-between",
              gap: "36px",
              [theme.breakpoints.down("md")]: {
                flexDirection: "column",
                marginLeft: 0,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                outline: "1px solid rgba(0, 0, 0, 0.1)",
                backgroundColor: "white",
                flexGrow: 3,
                minWidth: "300px",
                maxWidth: "800px",
                padding: "12px",
                gap: "12px",
              }}
            >
              <Box>
                <Typography
                  variant={"h1"}
                  sx={{
                    margin: "0px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "4",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {request.name}
                </Typography>
                <Box sx={{ display: "flex", gap: "6px" }}>
                  <Typography variant="description" lineHeight={"24px"}>
                    Created by{"  "}
                  </Typography>
                  <AvatarWithName
                    avatar={request.creator}
                    typography="description"
                    size="14px"
                    fontSize="14px"
                  />
                  <Typography variant="description" lineHeight={"24px"}>
                    on {new Date(request.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              {showManuallyEndStepButton && (
                <Box sx={{}}>
                  <EndRequestStepButton requestStepId={currRequestStepId} />
                </Box>
              )}
              <TriggerFieldSet
                fieldSet={request.flow.fieldSet}
                fieldAnswers={request.triggerFieldAnswers}
                onlyShowSelections={true}
              />
            </Box>
            {!!me &&
              acceptingNewResponses &&
              ((userResponses && userResponses.length === 0) || allowMultipleResponses) && (
                <Paper
                  elevation={4}
                  sx={(theme) => ({
                    flexGrow: 2,
                    minWidth: "300px",
                    maxWidth: "800px",
                    border: `solid ${theme.palette.primary.light} 2px`,
                    outline: `2px solid ${colors.primaryContainer}`,
                  })}
                >
                  <ResponseForm
                    requestStepId={request.requestSteps[request.currentStepIndex].requestStepId}
                    responseFields={request.requestSteps[request.currentStepIndex].fieldSet.fields}
                    permission={request.flow.steps[request.currentStepIndex].response?.permission}
                  />
                </Paper>
              )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", marginTop: "24px" }}>
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
      </Box>
    </PageContainer>
  );
};

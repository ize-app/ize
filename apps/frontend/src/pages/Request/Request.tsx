import { useQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";

import { AvatarWithName } from "@/components/Avatar";
import { BreadCrumbItem, Breadcrumbs } from "@/components/BreadCrumbs";
import { ConfigDiagramRequest } from "@/components/ConfigDiagram/ConfigDiagramRequest/ConfigDiagramRequest";
import { EndRequestStepButton } from "@/components/EndRequestStepButton";
import { TriggerDefinedOptionSets } from "@/components/Field/TriggerDefinedOptions";
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

export const Request = () => {
  const { requestId: shortRequestId } = useParams();
  const requestId = shortUUIDToFull(shortRequestId as string);
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const { me } = useContext(CurrentUserContext);
  const theme = useTheme();
  const navigate = useNavigate();

  const [currentTabIndex, setTabIndex] = useState(0);

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

  if (loading || !request) return <Loading />;
  const currentStep = request.flow.steps[request.currentStepIndex];
  const currentReqStep = request.requestSteps[request.currentStepIndex];

  const reusable: boolean = request.flow.reusable;
  const acceptingNewResponses: boolean = !currentReqStep.status.responseFinal;
  const userResponses: ResponseFragment[] = currentReqStep.userResponses;
  const allowMultipleResponses: boolean = !!currentStep.response?.allowMultipleResponses;
  const userIsCreator: boolean =
    (me?.user.entityId === request?.creator.entityId ||
      me?.identities.some((i) => i.entityId === request.creator.entityId)) ??
    false;
  const showManuallyEndStepButton: boolean =
    (currentStep.response?.canBeManuallyEnded &&
      userIsCreator &&
      !currentReqStep?.status.responseFinal) ??
    false;
  const currRequestStepId: string = currentReqStep.requestStepId;

  console.log("request is ", request);

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

  const breadcrumbItems: BreadCrumbItem[] = [
    {
      title: request.name,
      link: generatePath(Route.Request, {
        requestId: fullUUIDToShort(request.requestId),
      }),
    },
  ];

  if (reusable)
    breadcrumbItems.unshift(
      { title: "Flows", link: Route.Flows.toString() },
      {
        title: request.flow.name + (request.flow.group ? ` (${request.flow.group.name})` : ""),
        link: generatePath(Route.Flow, {
          flowId: fullUUIDToShort(request.flow.flowId),
          // Link to old version of flow if request is made from an older version
          flowVersionId:
            request.flow.flowVersionId !== request?.flow.currentFlowVersionId
              ? fullUUIDToShort(request.flow.flowVersionId)
              : null,
        }),
      },
    );
  else breadcrumbItems.unshift({ title: "Requests", link: Route.Home.toString() });

  return (
    <PageContainer>
      <Head
        title={"Request for " + request.flow.name}
        description={"Request for " + request.flow.name}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "36px" }}>
        {/* top component */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
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
              <TriggerDefinedOptionSets triggerDefinedOptionSets={request.triggerDefinedOptions} />
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
      </Box>
    </PageContainer>
  );
};

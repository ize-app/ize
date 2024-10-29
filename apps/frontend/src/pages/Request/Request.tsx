import { useQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import { Link, generatePath, useNavigate, useParams } from "react-router-dom";

import { AvatarWithName } from "@/components/Avatar";
import { ConfigDiagramRequest } from "@/components/ConfigDiagram/ConfigDiagramRequest/ConfigDiagramRequest";
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
  let userResponses: ResponseFragment[] | undefined = undefined;
  let allowMultipleResponses: boolean = false;

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
    reusable = request.flow.reusable;
    acceptingNewResponses = !request.requestSteps[request.currentStepIndex].status.responseFinal;
    userResponses = request.requestSteps[request.currentStepIndex].userResponses;
    allowMultipleResponses =
      !!request.flow.steps[request.currentStepIndex].response?.allowMultipleResponses;
  }

  // console.log("request is ", request);

  if (loading || !request) return <Loading />;

  const tabs: TabProps[] = [
    {
      title: "Status",
      content: <ConfigDiagramRequest request={request} />,
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
          <Typography variant={"body1"} fontWeight={600} color="primary">
            Request
          </Typography>
          <Typography
            variant={"h1"}
            marginBottom={".75rem"}
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "4",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {request.name}
          </Typography>
          {reusable && (
            <Typography variant={"description"} lineHeight={"24px"}>
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
            </Typography>
          )}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            marginTop: "36px",
            marginBottom: "36px",
            gap: "60px",
          }}
        >
          {!!me &&
            acceptingNewResponses &&
            ((userResponses && userResponses.length === 0) || allowMultipleResponses) && (
              <Paper
                elevation={4}
                sx={{
                  display: "block",
                  alignSelf: "center",
                  minWidth: "500px",
                  maxWidth: "800px",
                  border: `solid ${colors.primary} 2px`,
                  outline: `2px solid ${colors.primaryContainer}`,

                  [theme.breakpoints.down("md")]: {
                    width: "100%",
                    marginLeft: 0,
                    maxWidth: "100%",
                    minWidth: "300px",
                  },
                }}
              >
                <ResponseForm
                  requestStepId={request.requestSteps[request.currentStepIndex].requestStepId}
                  responseFields={request.requestSteps[request.currentStepIndex].fieldSet.fields}
                  permission={request.flow.steps[request.currentStepIndex].response?.permission}
                />
              </Paper>
            )}
          <Box
            sx={(theme) => ({
              display: "flex",
              [theme.breakpoints.down("md")]: {
                flexDirection: "column",
                gap: "36px",
              },
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              flexGrow: 1,
              // width: "fit-content",
              minWidth: "300px",

              // outline: "1px solid rgba(0, 0, 0, 0.1)",
              outline: `1px solid ${theme.palette.primary.main}`,
              padding: "16px 24px 16px 16px",
              borderRadius: "8px",

              gap: "60px",
              backgroundColor: theme.palette.background.paper,
            })}
          >
            {request.triggerFieldAnswers.length > 0 && (
              <Box
                sx={{
                  [theme.breakpoints.down("md")]: {
                    width: "100%",
                  },
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "300px",
                  width: "50%",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                <>
                  <Typography color="primary" variant="label" fontSize="1rem" marginBottom="12px">
                    Request context
                  </Typography>
                  <Box
                    sx={{
                      borderRadius: "8px",
                      outline: "1.25px solid rgba(0, 0, 0, 0.1)",
                      padding: "12px 16px 12px",
                    }}
                  >
                    <TriggerFieldSet
                      fieldSet={request.flow.fieldSet}
                      fieldAnswers={request.triggerFieldAnswers}
                      onlyShowSelections={true}
                    />
                  </Box>
                </>
              </Box>
            )}
            <Box
              sx={{
                [theme.breakpoints.down("md")]: {
                  width: "100%",
                },
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                minWidth: "300px",
                wordBreak: "break-word",
                width: request.triggerFieldAnswers.length > 0 ? "50%" : "100%",
              }}
            >
              <Typography color="primary" variant="label" fontSize="1rem" marginBottom="12px">
                Results
              </Typography>
              <RequestResults request={request} />
            </Box>
          </Box>
        </Box>
        <Box>
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

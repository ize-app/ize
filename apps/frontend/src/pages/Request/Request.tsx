import { useQuery } from "@apollo/client";
import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Link, generatePath, useNavigate, useParams } from "react-router-dom";

import { AvatarWithName } from "@/components/Avatar";
import { PanelHeader } from "@/components/ConfigDiagram";
import { ConfigDiagramRequest } from "@/components/ConfigDiagram/ConfigDiagramRequest/ConfigDiagramRequest";
import { ResponseForm } from "@/components/Form/ResponseForm/ResponseForm";
import { StatusTag } from "@/components/status/StatusTag";
import { DataTable } from "@/components/Tables/DataTable/DataTable";
import { Route } from "@/routers/routes";

import Loading from "../../components/Loading";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { GetRequestDocument, ResponseFragment, Status } from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { fullUUIDToShort, shortUUIDToFull } from "../../utils/inputs";

export const Request = () => {
  const { requestId: shortRequestId } = useParams();
  const requestId = shortUUIDToFull(shortRequestId as string);
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const navigate = useNavigate();

  let canRespond: boolean = false;
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
  // console.log(request);

  if (request) {
    canRespond = request.flow.steps[request.currentStepIndex].userPermission.response ?? false;
    userResponses = request.steps[request.currentStepIndex].userResponses;
    allowMultipleResponses =
      request.flow.steps[request.currentStepIndex].allowMultipleResponses ?? false;
  }

  const theme = useTheme();
  // const isOverMdScreen = useMediaQuery(theme.breakpoints.up("md"));

  return loading || !request ? (
    <Loading />
  ) : (
    <PageContainer>
      <Head
        title={"Request for " + request.flow.name}
        description={"Request for " + request.flow.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <Box>
          <Box>
            <Typography variant={"body1"} fontWeight={600} color="primary">
              Request
            </Typography>
            <Typography variant={"h1"} marginTop="8px">
              {request.name}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
              <Box
                sx={{
                  outline: "1px solid rgba(0, 0, 0, 0.1)",
                  width: "40%",
                  padding: "12px",
                  marginTop: "8px",
                  minWidth: "400px",
                }}
              >
                <DataTable
                  data={[
                    {
                      label: "Flow",
                      value: (
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
                          {request.flow.name}
                        </Link>
                      ),
                    },
                    {
                      label: "Status",
                      value: (
                        <StatusTag
                          status={request.final ? Status.Completed : Status.NotAttempted}
                        />
                      ),
                    },
                    { label: "Created by", value: <AvatarWithName avatar={request.creator} /> },
                    {
                      label: "Created at",
                      value: (
                        <Typography>{new Date(request.createdAt).toLocaleString()}</Typography>
                      ),
                    },
                  ]}
                  ariaLabel="Request context table"
                />
              </Box>
              {canRespond &&
                ((userResponses && userResponses.length === 0) || allowMultipleResponses) && (
                  <Paper sx={{ flexGrow: 1, width: "60%", minWidth: "400px" }}>
                    <PanelHeader>
                      <Typography color="primary" variant="label">
                        Respond
                      </Typography>
                    </PanelHeader>
                    <ResponseForm
                      requestStepId={request.steps[request.currentStepIndex].requestStepId}
                      responseFields={request.steps[request.currentStepIndex].responseFields}
                    />
                  </Paper>
                )}
            </Box>
          </Box>
        </Box>
        <ConfigDiagramRequest request={request} />
        <Box
          sx={(theme) => ({
            display: "flex",
            gap: "100px",
            justifyContent: "space-between",
            [theme.breakpoints.down("md")]: {
              flexDirection: "column-reverse",
              gap: "24px",
            },
          })}
        >
          <Box
            sx={(theme) => ({
              [theme.breakpoints.up("md")]: {
                flex: "1 400px",
              },
            })}
          ></Box>
          <Box
            sx={{
              [theme.breakpoints.up("md")]: {
                flex: "2 300px",
              },
            }}
          ></Box>
        </Box>
      </Box>
    </PageContainer>
  );
};

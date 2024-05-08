import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";

import { SnackbarContext } from "@/contexts/SnackbarContext";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { FlowFragment, GetFlowDocument } from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { fullUUIDToShort, shortUUIDToFull } from "../../utils/inputs";
import Loading from "../../components/Loading";
import {
  EvolveFlowRoute,
  evolveFlowRoute,
  NewRequestRoute,
  newRequestRoute,
  Route,
} from "@/routers/routes";
import { RequestStepsSearch } from "../Requests/RequestStepsSearch";
import { ConfigDiagramFlow } from "@/components/ConfigDiagram";

export const Flow = () => {
  const { me } = useContext(CurrentUserContext);
  const { flowId: flowIdShort, flowVersionId: flowVersionIdShort } = useParams();

  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);

  const flowId: string = shortUUIDToFull(flowIdShort as string);
  const flowVersionId: string | null = flowVersionIdShort
    ? shortUUIDToFull(flowVersionIdShort as string)
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

  // const { data: requestData, loading: requestLoading } = useQuery(RequestsForProcessDocument, {
  //   variables: {
  //     processId: processId,
  //   },
  // });

  const flow = flowData?.getFlow as FlowFragment;

  // console.log("flow is ", flow);
  const isCurrentFlowVersion = flow.flowVersionId === flow.currentFlowVersionId;

  const onError = () => {
    navigate("/");
    setSnackbarOpen(true);
    setSnackbarData({ message: "Cannot find this flow", type: "error" });
  };

  if (processError) onError();

  return flowLoading || !flow ? (
    <Loading />
  ) : (
    <PageContainer>
      <Head title={flow.name} description={""} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box>
            <Typography variant={"body1"} fontWeight={600} color="primary">
              Flow
            </Typography>
            <Typography variant={"h1"} marginTop="8px">
              {flow.name}
            </Typography>
            {!isCurrentFlowVersion && (
              <Typography>
                This page is displaying an older version of the flow that has since been evolved.
              </Typography>
            )}
          </Box>
          <br />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "8px",
              gap: "16px",
            }}
          >
            {isCurrentFlowVersion ? (
              <>
                <Button
                  variant="contained"
                  disabled={!flow.steps[0]?.userPermission.request}
                  sx={{
                    width: "140px",
                    display: !me ? "none" : "flex",
                  }}
                  onClick={() =>
                    navigate(
                      generatePath(newRequestRoute(NewRequestRoute.CreateRequest), {
                        flowId: fullUUIDToShort(flowId),
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
                        flowId: fullUUIDToShort(flowId),
                      }),
                    );
                  }}
                  disabled={!flow.evolve?.steps[0]?.request}
                  sx={{
                    width: "140px",
                    display: !me ? "none" : "flex",
                  }}
                >
                  Evolve flow
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                disabled={!flow.steps[0]?.userPermission.request}
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
        </Box>
        <ConfigDiagramFlow flow={flow} />
        {isCurrentFlowVersion && <RequestStepsSearch userOnly={false} flowId={flow.flowId} />}
      </Box>
    </PageContainer>
  );
};

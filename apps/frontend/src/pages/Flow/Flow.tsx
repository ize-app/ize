import { useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import { Chip, IconButton, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Link, generatePath, useNavigate, useParams } from "react-router-dom";

import { ConfigDiagramFlow } from "@/components/ConfigDiagram";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { SnackbarContext } from "@/contexts/SnackbarContext";
import {
  EvolveFlowRoute,
  NewRequestRoute,
  Route,
  evolveFlowRoute,
  newRequestRoute,
} from "@/routers/routes";

import Loading from "../../components/Loading";
import { FlowFragment, FlowType, GetFlowDocument } from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { fullUUIDToShort, shortUUIDToFull } from "../../utils/inputs";
import { RequestStepsSearch } from "../Requests/RequestStepsSearch";

export const Flow = () => {
  const { me } = useContext(CurrentUserContext);
  const { flowId: flowIdShort, flowVersionId: flowVersionIdShort } = useParams();

  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);

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
  console.log("flow is ", flow);

  const isCurrentFlowVersion = flow ? flow.flowVersionId === flow.currentFlowVersionId : true;
  const isDraft = flow ? !flow.active && !flow.versionPublishedAt : false;
  const isOldVersion = flow ? !flow.active && flow.versionPublishedAt : false;
  const isEvolveFlow = (flow && flow.type === FlowType.Evolve) ?? false;

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
            {isDraft && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Box sx={{ display: "flex", gap: "8px" }}>
                  <Chip label={"Draft"} size="small" />
                  <Typography>
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Box sx={{ display: "flex", gap: "8px" }}>
                  <Chip label={"Active"} size="small" />
                  {flow.versionPublishedAt && (
                    <Typography>
                      Most recent version published on{" "}
                      {new Date(flow.versionPublishedAt).toLocaleString(undefined, {
                        year: "numeric",
                        day: "numeric",
                        month: "long",
                      })}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            {isOldVersion && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Box sx={{ display: "flex", gap: "8px" }}>
                  <Chip label={"Old version"} size="small" />
                  {flow.versionPublishedAt && (
                    <Typography>
                      This version published on{" "}
                      {new Date(flow.versionPublishedAt).toLocaleString(undefined, {
                        year: "numeric",
                        day: "numeric",
                        month: "long",
                      })}
                    </Typography>
                  )}
                </Box>
                <Typography>
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
            {flow.evolve && (
              <Box sx={{ display: "flex", alignItems: "Center", marginTop: "8px" }}>
                <Typography>
                  <Link
                    to={generatePath(Route.Flow, {
                      flowId: fullUUIDToShort(flow.evolve.flowId),
                      flowVersionId: flow.evolve.currentFlowVersionId
                        ? fullUUIDToShort(flow.evolve.currentFlowVersionId)
                        : null,
                      // flowVersionId: null,
                    })}
                  >
                    How this flow evolves
                  </Link>
                </Typography>
                <Tooltip title="Every flow has another collaborative flow responsible for evolving it.">
                  <IconButton size="small">
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "16px",
              gap: "16px",
            }}
          >
            {isCurrentFlowVersion && !isEvolveFlow && (
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
                  disabled={!flow.evolve?.steps[0]?.request}
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
        <ConfigDiagramFlow flow={flow} />
        {isCurrentFlowVersion && <RequestStepsSearch userOnly={false} flowId={flow.flowId} />}
      </Box>
    </PageContainer>
  );
};

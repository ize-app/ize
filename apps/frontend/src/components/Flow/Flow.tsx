import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";

import { SnackbarContext } from "@/contexts/SnackbarContext";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { FlowFragment, GetFlowDocument } from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { fullUUIDToShort, shortUUIDToFull } from "../../utils/inputs";
import { Accordion } from "../shared/Accordion";
import Loading from "../shared/Loading";
import {
  EvolveFlowRoute,
  evolveFlowRoute,
  NewRequestRoute,
  newRequestRoute,
} from "@/routers/routes";

export const Flow = () => {
  const { me } = useContext(CurrentUserContext);
  const { flowId: flowIdShort } = useParams();

  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);

  const flowId: string = shortUUIDToFull(flowIdShort as string);
  const theme = useTheme();
  const isOverSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();

  const {
    data: flowData,
    loading: flowLoading,
    error: processError,
  } = useQuery(GetFlowDocument, {
    variables: {
      flowId: flowId,
    },
  });

  // const { data: requestData, loading: requestLoading } = useQuery(RequestsForProcessDocument, {
  //   variables: {
  //     processId: processId,
  //   },
  // });

  const flow = flowData?.getFlow as FlowFragment;

  // const requests = requestData?.requestsForProcess as RequestSummaryPartsFragment[];

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
            <Typography>{JSON.stringify(flow)}</Typography>
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
          </Box>
        </Box>
        <Box sx={{ maxWidth: "800px" }}>
          <Accordion
            label="How decisions are made"
            id="decision-panel"
            defaultExpanded={isOverSmScreen}
          >
            <div>Todo</div>
          </Accordion>
          {flow.type !== "Evolve" && (
            <Accordion label="How process evolves" id="decision-panel">
              {
                // TODO fix the evolve process type so there's no error
                //@ts-ignore
                // <DecisionSystemSummaryTable process={flow.evolve} />
              }
              <div>Todo</div>
            </Accordion>
          )}
          <Accordion label="Request format" id="request-format-panel">
            <div>Todo</div>
          </Accordion>
        </Box>
        <Box>
          {/* <RequestTab
            defaultFilterOption={FilterOptions.All}
            hideCreateButton
            requests={requests}
            loading={requestLoading}
          /> */}
        </Box>
      </Box>
    </PageContainer>
  );
};

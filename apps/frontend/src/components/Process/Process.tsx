import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";

import { DecisionSystemSummaryTable } from "./DecisionSystemSummaryTable";
import { RequestTemplateTable } from "./RequestTemplateTable";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import {
  ProcessDocument,
  ProcessSummaryPartsFragment,
  RequestSummaryPartsFragment,
  RequestsForProcessDocument,
} from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import {
  EditProcessRoute,
  NewRequestRoute,
  editProcessRoute,
  newRequestRoute,
} from "../../routers/routes";
import { fullUUIDToShort, shortUUIDToFull } from "../../utils/inputs";
import { Accordion } from "../shared/Accordion";
import Loading from "../shared/Loading";
import SummarizeAction from "../shared/Process/SummarizeAction";
import RequestTab, {
  FilterOptions,
} from "../shared/Tables/RequestsTable/RequestTab";

export const Process = () => {
  const { processId: processIdShort } = useParams();
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);

  const processId: string = shortUUIDToFull(processIdShort as string);
  const theme = useTheme();
  const isOverSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();

  const {
    data: processData,
    loading: processLoading,
    error: processError,
  } = useQuery(ProcessDocument, {
    variables: {
      processId: processId,
    },
  });

  const { data: requestData, loading: requestLoading } = useQuery(
    RequestsForProcessDocument,
    {
      variables: {
        processId: processId,
      },
    },
  );

  const process = processData?.process as ProcessSummaryPartsFragment;

  const requests =
    requestData?.requestsForProcess as RequestSummaryPartsFragment[];

  const onError = () => {
    navigate("/");
    setSnackbarOpen(true);
    setSnackbarData({ message: "Cannot find this process", type: "error" });
  };

  if (processError) onError();

  return processLoading || !process ? (
    <Loading />
  ) : (
    <PageContainer>
      <Head title={process.name} description={process.description ?? ""} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box>
            <Typography variant={"body1"} fontWeight={600} color="primary">
              Process
            </Typography>
            <Typography variant={"h1"} marginTop="8px">
              {process.name}
            </Typography>
          </Box>
          <Typography>{process.description}</Typography>
          <br />
          {process.action &&
          process.action.actionDetails.__typename === "WebhookAction" ? (
            <SummarizeAction
              uri={process.action.actionDetails.uri}
              optionTrigger={process.action.optionFilter?.value}
            />
          ) : null}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "16px",
              gap: "16px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                width: "140px",
                // TODO: Query user roles from group/individual
                display: true ? "flex" : "none",
              }}
              onClick={() =>
                navigate(
                  generatePath(newRequestRoute(NewRequestRoute.CreateRequest), {
                    processId: fullUUIDToShort(processId),
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
                  generatePath(editProcessRoute(EditProcessRoute.Intro), {
                    processId: fullUUIDToShort(process.id),
                  }),
                );
              }}
              sx={{
                width: "140px",
                // TODO: Query user roles from group/individual
                display: true ? "flex" : "none",
              }}
            >
              Edit process
            </Button>
          </Box>
        </Box>
        <Box sx={{ maxWidth: "800px" }}>
          <Accordion
            label="How decisions are made"
            id="decision-panel"
            defaultExpanded={isOverSmScreen}
          >
            <DecisionSystemSummaryTable process={process} />
          </Accordion>
          <Accordion label="How process evolves" id="decision-panel">
            <DecisionSystemSummaryTable
              process={process.evolve as ProcessSummaryPartsFragment}
            />
          </Accordion>
          <Accordion label="Request format" id="request-format-panel">
            <RequestTemplateTable process={process} />
          </Accordion>
        </Box>
        <Box>
          <RequestTab
            defaultFilterOption={FilterOptions.All}
            hideCreateButton
            requests={requests}
            loading={requestLoading}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContext } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";

import { CommunityRolesTable } from "./CommunityRolesTable";
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
import { NewRequestRoute, newRequestRoute } from "../../routers/routes";
import { fullUUIDToShort, shortUUIDToFull } from "../../utils/inputs";
import { Accordion } from "../shared/Accordion";
import Loading from "../shared/Loading";
import RequestTab, {
  FilterOptions,
} from "../shared/Tables/RequestsTable/RequestTab";

const truncatedUri = (uri: string) =>
  uri.substring(0, 15) + "..." + uri.substring(uri.length - 5, uri.length - 1);

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

  const { data: requestData, requestLoading: requestLoading } = useQuery(
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
    setSnackbarData({ message: "Invalid process", type: "error" });
  };

  return processError ? (
    onError()
  ) : processLoading || !process ? (
    <Loading />
  ) : (
    <>
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
          {process.webhookUri ? (
            <>
              <br />
              <Typography>
                After each decision, action run automatically via{" "}
                <a href={process.webhookUri}>
                  {truncatedUri(process.webhookUri)}
                </a>
              </Typography>
            </>
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
          <Accordion label="Community roles" id="community-role-panel">
            <CommunityRolesTable process={process} />
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
          />
        </Box>
      </Box>
    </>
  );
};

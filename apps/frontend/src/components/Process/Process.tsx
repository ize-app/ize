import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { generatePath, useNavigate, useParams } from "react-router-dom";

import { CommunityRolesTable } from "./CommunityRolesTable";
import { DecisionSystemSummaryTable } from "./DecisionSystemSummaryTable";
import { RequestTemplateTable } from "./RequestTemplateTable";
import { NewRequestRoute, newRequestRoute } from "../../routers/routes";
import { Accordion } from "../shared/Accordion";
import { processMockData } from "../shared/Tables/mockData";
import RequestTab, {
  FilterOptions,
} from "../shared/Tables/RequestsTable/RequestTab";

const truncatedUri = (uri: string) =>
  uri.substring(0, 15) + "..." + uri.substring(uri.length - 5, uri.length - 1);

export const Process = () => {
  const { processId } = useParams();
  const theme = useTheme();
  const isOverSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();

  const process = processMockData.find(
    (process) => process.processId === processId,
  );

  return process ? (
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
              display: process.userRoles.request ? "flex" : "none",
            }}
            onClick={() =>
              navigate(
                generatePath(newRequestRoute(NewRequestRoute.CreateRequest), {
                  processId: processId,
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
              display: process.userRoles.edit ? "flex" : "none",
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
          processId={process.processId}
        />
      </Box>
    </Box>
  ) : (
    <div>Hmmmmm.... can't find that process</div>
  );
};

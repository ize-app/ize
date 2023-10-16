import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useParams } from "react-router-dom";

import { processMockData } from "../shared/Tables/mockData";
import RequestTab from "../shared/Tables/RequestsTable/RequestTab";
import { Accordion } from "../Shared/Accordion";
import { FilterOptions } from "../shared/Tables/RequestsTable/RequestTab";
import { CommunityRolesTable } from "./CommunityRolesTable";
import { DecisionSystemSummaryTable } from "./DecisionSystemSummaryTable";
import { RequestTemplateTable } from "./RequestTemplateTable";

export const Process = () => {
  const { processId } = useParams();
  const theme = useTheme();
  const isOverSmScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const process = processMockData[+(processId as string) ?? 0];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant={"h1"}>{process.name}</Typography>
        <Typography>{process.description}</Typography>
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
  );
};

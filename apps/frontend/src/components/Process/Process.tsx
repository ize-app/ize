import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useParams } from "react-router-dom";
import { processMockData } from "../shared/Tables/mockData";

import RequestTab from "../shared/Tables/RequestsTable/RequestTab";
import { Accordion } from "../Shared/Accordion";

import { FilterOptions } from "../shared/Tables/RequestsTable/RequestTab";

export const Process = () => {
  const { processId } = useParams();

  const process = processMockData[+(processId as string) ?? 0];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Typography variant={"h1"}>{process.name}</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography>{process.description}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "300px",
            gap: "12px",
          }}
        >
          <Button variant="outlined" sx={{ width: "140px" }}>
            Create request
          </Button>
          <Button variant="outlined" sx={{ width: "140px" }}>
            Edit process
          </Button>
        </Box>
      </Box>
      <Box>
        <Accordion label="Community roles" id="community-role-panel">
          Test
        </Accordion>
        <Accordion label="How a decisions are made" id="decision-panel">
          Test
        </Accordion>
        <Accordion label="Request format" id="request-format-panel">
          Test
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

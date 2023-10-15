import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BarChart } from "@mui/x-charts";

import { useParams } from "react-router-dom";

import { requestMockData, ResponseCount } from "../Shared/Tables/mockData";
import { NameWithPopper } from "../Shared/Avatar";
import { RequestInputTable } from "../Shared/Request";
import { ResponseList } from "../Shared/Request/ResponseList";
import { SubmitResponse } from "../Shared/Request";
import { ProcessSummaryTable } from "../Shared/Request/ProcessSummary";

export default function HorizontalBars({
  responseCounts,
}: {
  responseCounts: ResponseCount[];
}) {
  return (
    <BarChart
      yAxis={[
        {
          scaleType: "band",
          data: responseCounts.map((elem) => elem.label),
          disableTicks: true,
        },
      ]}
      series={[
        {
          data: responseCounts.map((elem) => elem.count),
          id: "votes",
          xAxisKey: "bottomAxisKey",
        },
      ]}
      layout="horizontal"
      xAxis={[
        {
          id: "bottomAxisKey",
          label: "Response count",
          max: responseCounts.reduce(
            (acc, curr) => Math.max(acc, curr.count),
            0,
          ),
        },
      ]}
      width={350}
      height={300}
    />
  );
}

export const Request = () => {
  const { requestId } = useParams();
  const request = requestMockData[+(requestId as string) ?? 0];

  const theme = useTheme();
  const isUnderMdScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      <Box>
        <Typography variant={"h1"}>{request.name}</Typography>
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: "30px",
            flexWrap: "wrap",
            [theme.breakpoints.down("md")]: {
              flexDirection: "column",
              gap: "4px",
            },
          })}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: "12px" }}>
            <Chip label="Expires soon" color="warning" size="small" />
            <Typography>
              Expires on{" "}
              {request.expirationDate.toLocaleString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: ".3rem" }}>
            <Typography variant="body1"> Created by </Typography>{" "}
            <NameWithPopper
              users={[request.creator]}
              name={request.creator.name}
            />
          </Box>
        </Box>
      </Box>
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
              width: "400px",
            },
          })}
        >
          <Paper sx={{ marginBottom: "20px" }} elevation={4}>
            <SubmitResponse
              options={request.options}
              displayAsColumn={true}
              onSubmit={() => {
                return;
              }}
            />
          </Paper>
          <Accordion id="request-details-panel">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Results
            </AccordionSummary>
            <AccordionDetails>
              <HorizontalBars responseCounts={request.result.responseCount} />
            </AccordionDetails>
          </Accordion>
          <Accordion id="request-details-panel">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Responses
            </AccordionSummary>
            <AccordionDetails>
              <ResponseList responses={request.responses} />
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Accordion defaultExpanded={true} id="request-details-panel">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Request details
            </AccordionSummary>
            <AccordionDetails>
              <RequestInputTable rowSize="medium" inputs={request.inputs} />
            </AccordionDetails>
          </Accordion>
          <Accordion
            defaultExpanded={isUnderMdScreen}
            id="process-details-panel"
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              Process details
            </AccordionSummary>
            <AccordionDetails>
              <ProcessSummaryTable process={request.process} />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
};

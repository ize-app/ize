import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BarChart } from "@mui/x-charts";

import { useParams } from "react-router-dom";

import { Accordion } from "../Shared/Accordion";
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
              gap: "8px",
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
            <Typography variant="body1"> Requested by </Typography>{" "}
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
              flex: "1 400px",
            },
          })}
        >
          <Accordion
            id="submit-response-panel"
            defaultExpanded={true}
            label="Submit your response"
            elevation={6}
          >
            <SubmitResponse
              options={request.options}
              displayAsColumn={true}
              onSubmit={() => {
                return;
              }}
            />
          </Accordion>
          <Accordion label="Results" id="response-count-panel">
            <HorizontalBars responseCounts={request.result.responseCount} />
          </Accordion>
          <Accordion label="Responses" id="response-list-panel">
            <ResponseList responses={request.responses} />
          </Accordion>
        </Box>
        <Box
          sx={{
            // width: "100%"
            [theme.breakpoints.up("md")]: {
              flex: "2 300px",
            },
          }}
        >
          <Accordion
            label="Request details"
            id="request-details-panel"
            defaultExpanded={true}
          >
            <RequestInputTable rowSize="medium" inputs={request.inputs} />
          </Accordion>
          <Accordion
            label="Process details"
            id="process-details-panel"
            defaultExpanded={isUnderMdScreen}
          >
            <ProcessSummaryTable process={request.process} />
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
};

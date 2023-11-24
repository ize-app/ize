import { useQuery } from "@apollo/client";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BarChart } from "@mui/x-charts/BarChart";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SnackbarContext } from "../../contexts/SnackbarContext";
import {
  AgentSummaryPartsFragment,
  RequestDocument,
  RequestSummaryPartsFragment,
  Response,
  ResponseCount,
  Result,
  ResultSummaryPartsFragment,
} from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import {
  intervalToIntuitiveTimeString,
  shortUUIDToFull,
} from "../../utils/inputs";
import { Accordion } from "../shared/Accordion";
import { NameWithPopper } from "../shared/Avatar";
import Loading from "../shared/Loading";
import {
  FinalDecision,
  RequestInputTable,
  SubmitResponse,
} from "../shared/Request";
import { ProcessSummaryTable } from "../shared/Request/ProcessSummary";
import { ResponseList } from "../shared/Request/ResponseList";

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
          data: responseCounts.map((elem) => elem.value),
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

export const RemainingTime = ({
  expirationDate,
  result,
}: {
  expirationDate: Date;
  result: ResultSummaryPartsFragment | undefined;
}) => {
  const now = new Date();
  const timeLeft = expirationDate.getTime() - now.getTime();
  const timeLeftStr = intervalToIntuitiveTimeString(timeLeft);
  const displayRed = timeLeft < 1000 * 60 * 60 * 24;

  if (result) {
    return (
      <>
        <Chip label={"Closed"} color="secondary" size="small" />
        <Typography>
          Decision on{" "}
          {expirationDate.toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Typography>
      </>
    );
  } else if (timeLeft < 0) {
    return (
      <>
        <Chip label={"Closed"} color="secondary" size="small" />
        <Typography>
          Expired on{" "}
          {expirationDate.toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Typography>
      </>
    );
  } else {
    return (
      <>
        <Chip label="Open" color="primary" size="small" />
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <AccessAlarmIcon
            fontSize="small"
            color={displayRed ? "error" : "primary"}
          />
          <Typography color={displayRed ? "error" : "primary"}>
            {timeLeftStr} left to respond
          </Typography>
        </Box>
      </>
    );
  }
};

export const Request = () => {
  const { requestId: shortRequestId } = useParams();
  const requestId = shortUUIDToFull(shortRequestId as string);
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(RequestDocument, {
    variables: {
      requestId: requestId,
    },
  });

  const onError = () => {
    navigate("/");
    setSnackbarOpen(true);
    setSnackbarData({ message: "Cannot find this request", type: "error" });
  };

  if (error) onError();

  const request = data?.request as RequestSummaryPartsFragment;
  console.log("request is ", request);

  const theme = useTheme();
  const isOverMdScreen = useMediaQuery(theme.breakpoints.up("md"));

  return loading || !request ? (
    <Loading />
  ) : (
    <PageContainer>
      <Head
        title={request.name}
        description={"Process: " + request.process.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        <Box>
          <Box>
            <Typography variant={"body1"} fontWeight={600} color="primary">
              Request
            </Typography>
            <Typography variant={"h1"} marginTop="8px">
              {request.name}
            </Typography>
          </Box>
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
              <RemainingTime
                expirationDate={new Date(Date.parse(request.expirationDate))}
                result={request.result ?? undefined}
              />
            </Box>
            <Box sx={{ display: "flex", gap: ".3rem" }}>
              <Typography variant="body1"> Requested by </Typography>{" "}
              <NameWithPopper
                agents={[request.creator as AgentSummaryPartsFragment]}
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
            {request.result ||
            new Date() > new Date(Date.parse(request.expirationDate)) ? (
              <FinalDecision
                expirationDate={new Date(Date.parse(request.expirationDate))}
                result={request.result as Result}
                userResponse={request.responses.userResponse as Response}
              />
            ) : (
              <Accordion
                id="submit-response-panel"
                defaultExpanded={true}
                label={
                  request?.responses?.userResponse
                    ? "Your response"
                    : "Submit your response"
                }
                elevation={6}
              >
                <SubmitResponse
                  options={request.process.options}
                  displayAsColumn={true}
                  requestId={request.id}
                  userResponse={request.responses.userResponse as Response}
                  onSubmit={() => {
                    return;
                  }}
                />
              </Accordion>
            )}

            <Accordion label="Results" id="response-count-panel">
              {request.responses.userResponse ? (
                <HorizontalBars
                  responseCounts={request.responses.responseCount}
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Typography>
                    Please respond before you can see the other responses
                  </Typography>
                </Box>
              )}
            </Accordion>
            <Accordion label="Responses" id="response-list-panel">
              {request.responses.userResponse ? (
                <ResponseList
                  responses={request.responses.allResponses as Response[]}
                />
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "8px",
                  }}
                >
                  <Typography>
                    Please respond before you can see the other responses
                  </Typography>
                </Box>
              )}
            </Accordion>
          </Box>
          <Box
            sx={{
              [theme.breakpoints.up("md")]: {
                flex: "2 300px",
              },
            }}
          >
            {request.inputs.length === 0 ? null : (
              <Accordion
                label="Request details"
                id="request-details-panel"
                defaultExpanded={true}
              >
                <RequestInputTable rowSize="medium" inputs={request.inputs} />
              </Accordion>
            )}
            <Accordion
              label="Process details"
              id="process-details-panel"
              defaultExpanded={isOverMdScreen}
            >
              <ProcessSummaryTable process={request.process} />
            </Accordion>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};

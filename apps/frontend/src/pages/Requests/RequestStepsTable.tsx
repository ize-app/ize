import BoltIcon from "@mui/icons-material/Bolt";
import { Box, Typography, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { generatePath, useNavigate } from "react-router-dom";

import { TableCellHideable } from "@/components/Tables/TableCellHideable";
import { RequestSummaryFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { ExpirationStatus } from "./tableComponents/ExpirationStatus";
import { RequestStepTitle } from "./tableComponents/RequestStepTitle";
import { ResponseStatus } from "./tableComponents/ResponseStatus";

export const RequestSummaryTable = ({ requests }: { requests: RequestSummaryFragment[] }) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial", minWidth: "360px" }}>
      <Table aria-label="Request Table" sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableHead></TableHead>
        <TableBody>
          {requests.map((requestStep) => (
            <RequestSummaryRow key={requestStep.requestId} request={requestStep} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RequestSummaryRow = ({ request }: { request: RequestSummaryFragment }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const responseComplete = request.currentStep.status.responseFinal;
  const result = request.currentStep.result?.results[0];
  const action = request.currentStep.action;
  const userResponded = request.currentStep.userResponded;
  const userRespondPermission = request.currentStep.userRespondPermission;

  // console.log("results ", request.currentStep.result?.results);

  return (
    <>
      <TableRow
        aria-label="Request Row"
        onClick={() =>
          navigate(
            generatePath(Route.Request, {
              requestId: fullUUIDToShort(request.requestId),
            }),
          )
        }
      >
        <TableCellHideable
          component="th"
          scope="row"
          align="left"
          sx={{
            width: "55%", // Allocate more space to the first column
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <RequestStepTitle request={request} />
        </TableCellHideable>
        <TableCellHideable
          align="right"
          // width="200px"
          sx={{ width: "45%", minWidth: "240px", maxWidth: "400px" }}
        >
          {!responseComplete && (
            <Box
              sx={{
                display: "flex",
                gap: "24px",
                justifyContent: "flex-end",
                // width: "200px",
              }}
            >
              {!userResponded && (
                <ExpirationStatus expirationDate={new Date(request.currentStep.expirationDate)} />
              )}

              <ResponseStatus
                userResponded={userResponded}
                responsePermission={userRespondPermission}
              />
            </Box>
          )}

          {responseComplete && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                flexDirection: "column",
                gap: "4px",
                padding: "0 4px",
              }}
            >
              {result ? (
                <Typography
                  variant="description"
                  color={theme.palette.success.main}
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "2",
                    whiteSpace: "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "right",
                  }}
                >
                  {result.resultItems.map((ri) => ri.value).join(", ")}
                </Typography>
              ) : (
                <Typography variant="description">No result</Typography>
              )}
              {action && (
                <Box sx={{ display: "flex", gap: "4px" }}>
                  <BoltIcon color="secondary" fontSize="small" />
                  <Typography
                    variant="description"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: "1",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {action.name}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </TableCellHideable>
      </TableRow>
    </>
  );
};

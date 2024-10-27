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
      <Table aria-label="Request Table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable sx={{ minWidth: "140px" }}>Request</TableCellHideable>
            <TableCellHideable align="center" width={"100px"}>
              Expiration
            </TableCellHideable>
            <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
              Response
            </TableCellHideable>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((requestStep) => (
            <RequestSummaryRow key={requestStep.requestStepId} request={requestStep} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RequestSummaryRow = ({ request }: { request: RequestSummaryFragment }) => {
  const navigate = useNavigate();

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
        <TableCellHideable component="th" scope="row" align="left">
          <RequestStepTitle
            flowName={request.flowName}
            requestName={request.requestName}
            creator={request.creator}
            totalSteps={request.totalSteps}
            stepIndex={request.stepIndex}
          />
        </TableCellHideable>
        <TableCellHideable align="center" width={"160px"}>
          <ExpirationStatus expirationDate={new Date(request.expirationDate)} />
        </TableCellHideable>
        <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
          <ResponseStatus
            userResponded={request.userResponded}
            responseComplete={request.status.responseFinal}
          />
        </TableCellHideable>
      </TableRow>
    </>
  );
};

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { generatePath, useNavigate } from "react-router-dom";

import { TableCellHideable } from "@/components/Tables/TableCellHideable";
import { RequestStepSummaryFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { ExpirationStatus } from "./tableComponents/ExpirationStatus";
import { RequestStepTitle } from "./tableComponents/RequestStepTitle";
import { ResponseStatus } from "./tableComponents/ResponseStatus";

export const RequestStepsTable = ({
  requestSteps,
}: {
  requestSteps: RequestStepSummaryFragment[];
}) => {
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
          {requestSteps.map((requestStep) => (
            <RequestStepRow key={requestStep.requestStepId} requestStep={requestStep} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RequestStepRow = ({ requestStep }: { requestStep: RequestStepSummaryFragment }) => {
  const navigate = useNavigate();

  return (
    <>
      <TableRow
        aria-label="Request Row"
        onClick={() =>
          navigate(
            generatePath(Route.Request, {
              requestId: fullUUIDToShort(requestStep.requestId),
            }),
          )
        }
      >
        <TableCellHideable component="th" scope="row" align="left">
          <RequestStepTitle
            flowName={requestStep.flowName}
            requestName={requestStep.requestName}
            creator={requestStep.creator}
            totalSteps={requestStep.totalSteps}
            stepIndex={requestStep.stepIndex}
          />
        </TableCellHideable>
        <TableCellHideable align="center" width={"160px"}>
          <ExpirationStatus expirationDate={new Date(requestStep.expirationDate)} />
        </TableCellHideable>
        <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
          <ResponseStatus
            userResponded={requestStep.userResponded}
            responseComplete={requestStep.responseComplete}
          />
        </TableCellHideable>
      </TableRow>
    </>
  );
};

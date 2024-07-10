import CheckCircleIcon from "@mui/icons-material/CheckCircleOutlined";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { generatePath, useNavigate } from "react-router-dom";

import {
  AvatarsCell,
  StatusCell,
  TableCellHideable,
  TwoTierCell,
} from "@/components/Tables/TableCells";
import { RequestStepSummaryFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

export const RequestStepsTable = ({
  requestSteps,
}: {
  requestSteps: RequestStepSummaryFragment[];
}) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial" }}>
      <Table aria-label="Request Table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable>Request</TableCellHideable>
            <TableCellHideable align="center" width={"100px"}>
              Status
            </TableCellHideable>
            <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
              Response
            </TableCellHideable>
            <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
              Creator
            </TableCellHideable>
            {/* <TableCell align="right" width={"100px"}></TableCell> */}
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

  const stepProgress =
    requestStep.totalSteps > 1
      ? ` (Step ${requestStep.stepIndex + 1} of ${requestStep.totalSteps})`
      : ``;

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
        <TwoTierCell
          component="th"
          scope="row"
          align="left"
          topText={requestStep.flowName}
          bottomText={requestStep.requestName + stepProgress}
        />
        <StatusCell
          expirationDate={new Date(requestStep.expirationDate)}
          final={requestStep.final}
          alreadyResponded={false}
        />
        <TableCellHideable align="center" width={"100px"} hideOnSmallScreen>
          {requestStep.userResponded ? (
            <CheckCircleIcon color={"success"} fontSize="small" />
          ) : null}
        </TableCellHideable>
        <AvatarsCell align="center" avatars={[requestStep.creator]} hideOnSmallScreen={true} />
      </TableRow>
    </>
  );
};

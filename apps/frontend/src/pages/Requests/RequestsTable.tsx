import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { generatePath, useNavigate } from "react-router-dom";

import { TableCellHideable } from "@/components/Tables/TableCellHideable";
import { RequestSummaryFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { RequestStepTitle } from "./tableComponents/RequestStepTitle";
import { ResponseStatus } from "./tableComponents/ResponseStatus";

dayjs.extend(utc);
dayjs.extend(timezone);

export const RequestSummaryTable = ({ requests }: { requests: RequestSummaryFragment[] }) => {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial", minWidth: "300px" }}>
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

  return (
    <>
      <TableRow
        aria-label="Triggered flow Row"
        onClick={() =>
          navigate(
            generatePath(Route.Request, {
              requestId: fullUUIDToShort(request.requestId),
            }),
          )
        }
      >
        <TableCellHideable align="center" width={"60px"} hideOnSmallScreen>
          {dayjs.utc(request.createdAt).tz(dayjs.tz.guess()).format("MM/D").toString()}
        </TableCellHideable>
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
          hideOnSmallScreen
          align="right"
          // width="200px"
          sx={{ width: "50%", minWidth: "240px", maxWidth: "400px" }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "24px",
              justifyContent: "flex-end",
              // width: "200px",
              width: "100%",
            }}
          >
            <ResponseStatus request={request} />
          </Box>
        </TableCellHideable>
      </TableRow>
    </>
  );
};

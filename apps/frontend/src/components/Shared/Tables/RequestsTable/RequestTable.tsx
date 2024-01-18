import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { generatePath, useNavigate } from "react-router-dom";

import { ExpandedRequest } from "./ExpandedRequest";
import { AvatarsCell, StatusCell, TableCellHideable, TwoTierCell } from "../TableCells";

import { RequestSummaryPartsFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

function RequestRow(props: { request: RequestSummaryPartsFragment }) {
  const { request } = props;
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const expirationDate = new Date(Date.parse(request.expirationDate));

  const userResponse = request.responses.userResponse?.value as string;

  const alreadyResponded = !!userResponse;
  const noFinalDecision = !request.result;
  const notExpired = expirationDate >= new Date();
  const isOpenRequest = noFinalDecision && notExpired;

  return (
    <React.Fragment>
      <TableRow
        onClick={() =>
          navigate(
            generatePath(Route.Request, {
              requestId: fullUUIDToShort(request.id),
            }),
          )
        }
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
          backgroundColor: isOpenRequest ? "" : "#F7F2FA",
        }}
      >
        <TwoTierCell
          topText={request.process.name}
          bottomText={request.name}
          component="th"
          scope="row"
        />
        <AvatarsCell align="center" avatars={[request.creator]} hideOnSmallScreen={true} />
        <StatusCell
          align="center"
          hideOnSmallScreen={true}
          expirationDate={expirationDate}
          alreadyResponded={alreadyResponded}
          result={request.result ?? undefined}
        ></StatusCell>
        <TableCellHideable align={"center"}>
          {!alreadyResponded && notExpired ? (
            <Button
              variant="outlined"
              endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
              aria-label="expand row"
            >
              Respond
            </Button>
          ) : (
            <Typography>
              {alreadyResponded
                ? userResponse.substring(0, 12) + (userResponse.length > 12 ? "..." : "")
                : "-"}
            </Typography>
          )}
        </TableCellHideable>
      </TableRow>
      {!alreadyResponded && isOpenRequest && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <ExpandedRequest request={request} collapseRow={() => setOpen(false)} />
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

interface RequestTableProps {
  requests: RequestSummaryPartsFragment[];
}

export default function RequestTable({ requests }: RequestTableProps) {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial" }}>
      <Table aria-label="collapsible table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable sx={{ maxWidth: "50%" }}>Request</TableCellHideable>
            <TableCellHideable align="center" sx={{ minWidth: "100px" }} hideOnSmallScreen={true}>
              Creator
            </TableCellHideable>
            <TableCellHideable hideOnSmallScreen={true} sx={{ minWidth: "100px" }} align="center">
              Status
            </TableCellHideable>
            <TableCell align="center" width={"70px"}>
              Your response
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <RequestRow key={request.id} request={request} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

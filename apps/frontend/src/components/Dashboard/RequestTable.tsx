import * as React from "react";
import { useNavigate } from "react-router-dom";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { AvatarProps } from "../shared/Avatar";
import { mockData } from "./mockData";
import {
  TwoTierCell,
  AvatarsCell,
  StatusCell,
  TableCellHideable,
} from "./TableCells";

// TODO: this is just the shape of the mock data - will change when we hydrate with real data
export interface RequestProps {
  requestId: string;
  process: string;
  request: string;
  creator: AvatarProps[];
  respond: AvatarProps[];
  expirationDate: string;
  decisionType: string;
  userResponse: string | null;
}

function RequestRow(props: { request: RequestProps }) {
  const { request } = props;
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleTableRowOnClick = () => {
    navigate(`/request/${request.requestId}`);
  };

  const alreadyResponded = typeof request.userResponse === "string";

  return (
    <React.Fragment>
      <TableRow
        onClick={handleTableRowOnClick}
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: !alreadyResponded ? "" : "#F7F2FA",
        }}
      >
        <TwoTierCell
          topText={request.process}
          bottomText={request.request}
          component="th"
          scope="row"
        />
        <AvatarsCell avatars={request.creator} hideOnSmallScreen={true} />
        <StatusCell
          align="center"
          hideOnSmallScreen={true}
          expirationDateString={request.expirationDate}
        ></StatusCell>
        <TableCellHideable align={"center"}>
          {!alreadyResponded ? (
            <Button
              variant="outlined"
              endIcon={
                open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
              }
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
            <Typography>{request.userResponse}</Typography>
          )}
        </TableCellHideable>{" "}
      </TableRow>
      {!alreadyResponded && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  To be created....
                </Typography>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

export default function RequestTable() {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "initial" }}>
      <Table aria-label="collapsible table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable sx={{ maxWidth: "50%" }}>
              Request
            </TableCellHideable>
            <TableCellHideable
              align="center"
              sx={{ minWidth: "100px" }}
              hideOnSmallScreen={true}
            >
              Creator
            </TableCellHideable>
            <TableCellHideable
              hideOnSmallScreen={true}
              sx={{ minWidth: "100px" }}
              align="center"
            >
              Status
            </TableCellHideable>
            <TableCell align="center" width={"70px"}>
              Response
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockData.map((request) => (
            <RequestRow key={request.requestId} request={request} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

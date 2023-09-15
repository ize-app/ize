import * as React from "react";
import { useNavigate } from "react-router-dom";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { AvatarGroup, AvatarProps, AvatarsProps } from "../shared/Avatar";
import { mockData } from "./mockData";

// TODO: this is just the shape of the mock data - will change when we hydrate with real data
export interface RequestProps {
  requestId: string;
  process: string;
  request: string;
  creator: AvatarProps[];
  respond: AvatarProps[];
  expirationDate: string;
  decisionType: string;
  userVote: string;
}

interface TwoTierCellProps {
  topText: string;
  bottomText: string;
  topStyleOverrides?: SxProps;
  bottomStyleOverrides?: SxProps;
}

const TwoTierCell = ({
  topText,
  bottomText,
  topStyleOverrides,
  bottomStyleOverrides,
}: TwoTierCellProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <Typography variant="label" sx={topStyleOverrides}>
        {topText}
      </Typography>
      <Typography sx={bottomStyleOverrides}>{bottomText}</Typography>
    </Box>
  );
};

const AvatarsCell = ({ avatars }: AvatarsProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <AvatarGroup avatars={avatars} />
    </Box>
  );
};

const StatusCell = ({
  expirationDateString,
}: {
  expirationDateString: string;
}): JSX.Element => {
  const now = new Date();
  const expirationDate = new Date(expirationDateString);
  const remainingMinutes =
    (expirationDate.getTime() - now.getTime()) / (1000 * 60);

  // TODO: this sbhould actually be the lesser of the expirationDate and when the decision was made
  if (remainingMinutes < 0) {
    return (
      <TwoTierCell
        topText="Closed"
        bottomText={expirationDate.toLocaleString("en-US", {
          day: "numeric",
          year: "numeric",
          month: "short",
        })}
      ></TwoTierCell>
    );
  } else if (remainingMinutes < 60)
    return (
      <TwoTierCell
        topText="Open"
        bottomText={`${Math.ceil(remainingMinutes)} minute${
          Math.ceil(remainingMinutes) > 1 ? "s" : ""
        } left`}
        bottomStyleOverrides={{ color: "red" }}
      ></TwoTierCell>
    );
  else if (remainingMinutes < 60 * 24)
    return (
      <TwoTierCell
        topText="Open"
        bottomText={`${Math.floor(remainingMinutes / 60)} hour${
          Math.floor(remainingMinutes / 60) > 1 ? "s" : ""
        } left`}
        bottomStyleOverrides={{ color: "red" }}
      ></TwoTierCell>
    );
  else
    return (
      <TwoTierCell
        topText="Open"
        bottomText={`${Math.floor(remainingMinutes / (60 * 24))} day${
          Math.floor((remainingMinutes / 60) * 24) > 1 ? "s" : ""
        } left`}
      ></TwoTierCell>
    );
};

function ProposalRow(props: { request: RequestProps }) {
  const { request } = props;
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const handleTableRowOnClick = () => {
    navigate(`/request/${request.requestId}`);
  };

  return (
    <React.Fragment>
      <TableRow
        onClick={handleTableRowOnClick}
        sx={{ "& > *": { borderBottom: "unset" } }}
      >
        <TableCell component="th" scope="row">
          <TwoTierCell topText={request.process} bottomText={request.request} />
        </TableCell>
        <TableCell>{<AvatarsCell avatars={request.creator} />}</TableCell>
        <TableCell align="center">
          <StatusCell
            expirationDateString={request.expirationDate}
          ></StatusCell>
        </TableCell>
        <TableCell align="center">
          <TwoTierCell
            topText={request.decisionType}
            bottomText={"6 hours left"}
          />
        </TableCell>
        <TableCell align={"right"}>
          Vote
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            // onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
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
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>Request</TableCell>
            <TableCell align="center">Creator</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Decision</TableCell>
            <TableCell align="right">Your vote</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockData.map((request) => (
            <ProposalRow key={request.requestId} request={request} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

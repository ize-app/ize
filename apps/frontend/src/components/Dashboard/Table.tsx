import * as React from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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
}

const TwoTierCell = ({ topText, bottomText }: TwoTierCellProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
    >
      <Typography variant="label">{topText}</Typography>
      <Typography>{bottomText}</Typography>
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

function ProposalRow(props: { request: RequestProps }) {
  const { request } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          <TwoTierCell topText={request.process} bottomText={request.request} />
        </TableCell>
        <TableCell>{<AvatarsCell avatars={request.creator} />}</TableCell>
        <TableCell>{<AvatarsCell avatars={request.respond} />}</TableCell>
        <TableCell align="center">{request.expirationDate}</TableCell>
        <TableCell align="center">{request.decisionType}</TableCell>
        <TableCell align={"right"}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
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
            <TableCell align="center">Respond</TableCell>
            <TableCell align="center">Closes</TableCell>
            <TableCell align="center">Decision</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {mockData.map((request) => (
            <ProposalRow key={request.request} request={request} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

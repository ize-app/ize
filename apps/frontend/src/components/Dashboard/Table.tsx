import * as React from "react";
import { useNavigate } from "react-router-dom";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { SxProps, TableCellProps, styled } from "@mui/material";
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

import { AvatarGroup, AvatarProps } from "../shared/Avatar";
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

interface TwoTierCellProps extends TableCellHideableProps {
  topText: string;
  bottomText: string;
  topStyleOverrides?: SxProps;
  bottomStyleOverrides?: SxProps;
}

interface StatusCellProps extends TableCellHideableProps {
  expirationDateString: string;
}

interface AvatarsCellProps extends TableCellHideableProps {
  avatars: AvatarProps[];
}

const TwoTierCell = ({
  topText,
  bottomText,
  topStyleOverrides,
  bottomStyleOverrides,
  ...props
}: TwoTierCellProps) => {
  return (
    <TableCellHideable {...props}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <Typography
          variant="label"
          sx={{
            ...topStyleOverrides,
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxHeight: "2.4rem",
            lineHeight: "1.2rem",
            "-webkit-line-clamp": 2,
          }}
        >
          {topText}
        </Typography>
        <Typography
          sx={{
            ...bottomStyleOverrides,
            textOverflow: "ellipsis",
            overflow: "hidden",
            maxHeight: "2.4rem",
            lineHeight: "1.2rem",
            "-webkit-line-clamp": 2,
          }}
        >
          {bottomText}
        </Typography>
      </Box>
    </TableCellHideable>
  );
};

const AvatarsCell = ({ avatars, ...props }: AvatarsCellProps): JSX.Element => {
  console.log("avatars are ", avatars);
  return (
    <TableCellHideable {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AvatarGroup avatars={avatars} />
      </Box>
    </TableCellHideable>
  );
};

const HiddenCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

interface TableCellHideableProps extends TableCellProps {
  hideOnSmallScreen?: boolean;
}

const TableCellHideable = ({
  hideOnSmallScreen,
  ...props
}: TableCellHideableProps): JSX.Element => {
  return hideOnSmallScreen ? (
    <HiddenCell {...props}>{props.children}</HiddenCell>
  ) : (
    <TableCell sx={{}} {...props}>
      {props.children}
    </TableCell>
  );
};

const StatusCell = ({
  expirationDateString,
  ...props
}: StatusCellProps): JSX.Element => {
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
        {...props}
      />
    );
  } else if (remainingMinutes < 60)
    return (
      <TwoTierCell
        topText="Open"
        bottomText={`${Math.ceil(remainingMinutes)} minute${
          Math.ceil(remainingMinutes) > 1 ? "s" : ""
        } left`}
        bottomStyleOverrides={{ color: "red" }}
        {...props}
      />
    );
  else if (remainingMinutes < 60 * 24)
    return (
      <TwoTierCell
        topText="Open"
        bottomText={`${Math.floor(remainingMinutes / 60)} hour${
          Math.floor(remainingMinutes / 60) > 1 ? "s" : ""
        } left`}
        bottomStyleOverrides={{ color: "red" }}
        {...props}
      />
    );
  else
    return (
      <TwoTierCell
        topText="Open"
        bottomText={`${Math.floor(remainingMinutes / (60 * 24))} day${
          Math.floor((remainingMinutes / 60) * 24) > 1 ? "s" : ""
        } left`}
        {...props}
      />
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
        <TwoTierCell
          topText={request.process}
          bottomText={request.request}
          component="th"
          scope="row"
        />
        <AvatarsCell avatars={request.creator} hideOnSmallScreen={true} />
        <StatusCell
          align="center"
          expirationDateString={request.expirationDate}
        ></StatusCell>
        <TwoTierCell
          topText={request.decisionType}
          bottomText={"6 hours left"}
          hideOnSmallScreen={true}
          align="center"
        />
        <TableCellHideable align={"right"}>
          Vote
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCellHideable>
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
    <TableContainer component={Paper} sx={{ overflowX: "initial" }}>
      <Table aria-label="collapsible table" stickyHeader={true}>
        <TableHead>
          <TableRow>
            <TableCellHideable sx={{ maxWidth: "50%" }}>
              Request
            </TableCellHideable>
            <TableCellHideable align="center" hideOnSmallScreen={true}>
              Creator
            </TableCellHideable>
            <TableCellHideable align="center">Status</TableCellHideable>
            <TableCellHideable hideOnSmallScreen={true} align="center">
              Decision
            </TableCellHideable>
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

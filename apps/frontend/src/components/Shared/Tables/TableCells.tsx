import { SxProps, TableCellProps, styled } from "@mui/material";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

import {
  ResultSummaryPartsFragment,
  AgentSummaryPartsFragment,
  UserSummaryPartsFragment,
} from "../../../graphql/generated/graphql";
import { intervalToIntuitiveTimeString } from "../../../utils/inputs";
import { AvatarGroup } from "../Avatar";

interface TableCellHideableProps extends TableCellProps {
  hideOnSmallScreen?: boolean;
}

interface TwoTierCellProps extends TableCellHideableProps {
  topText: string;
  bottomText: string;
  topStyleOverrides?: SxProps;
  bottomStyleOverrides?: SxProps;
}

interface StatusCellProps extends TableCellHideableProps {
  expirationDate: Date;
  alreadyResponded: boolean;
  result: ResultSummaryPartsFragment | undefined;
}

interface AvatarsCellProps extends TableCellHideableProps {
  avatars: (AgentSummaryPartsFragment | UserSummaryPartsFragment)[];
  align: "center" | "left";
}

export const HiddenCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export const TableCellHideable = ({
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

export const TwoTierCell = ({
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
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: "1",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {topText}
        </Typography>
        <Typography
          sx={{
            ...bottomStyleOverrides,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: "1",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {bottomText}
        </Typography>
      </Box>
    </TableCellHideable>
  );
};

export const AvatarsCell = ({
  avatars,
  align = "center",
  ...props
}: AvatarsCellProps): JSX.Element => {
  return (
    <TableCellHideable {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        <AvatarGroup agents={avatars} />
      </Box>
    </TableCellHideable>
  );
};

export const StatusCell = ({
  expirationDate,
  alreadyResponded,
  result,
  ...props
}: StatusCellProps): JSX.Element => {
  const now = new Date();
  const timeLeft = expirationDate.getTime() - now.getTime();
  const timeLeftStr = intervalToIntuitiveTimeString(timeLeft);

  // TODO: this sbhould actually be the lesser of the expirationDate and when the decision was made
  if (result) {
    return (
      <TwoTierCell topText="Final decision" bottomText={result.selectedOption.value} {...props} />
    );
  } else if (timeLeft < 0) {
    return (
      <TableCellHideable align="center">
        <Typography color="red">Expired</Typography>
      </TableCellHideable>
    );
  } else {
    return (
      <TwoTierCell
        topText="Open"
        bottomText={timeLeftStr}
        bottomStyleOverrides={{
          color: alreadyResponded || timeLeft > 1000 * 60 * 60 * 24 ? "" : "red",
        }}
        {...props}
      />
    );
  }
};

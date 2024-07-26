import { SxProps, TableCellProps, styled } from "@mui/material";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

import { intervalToIntuitiveTimeString } from "@/utils/inputs";

import {
  EntitySummaryPartsFragment,
  Status,
  UserSummaryPartsFragment,
} from "../../graphql/generated/graphql";
import { AvatarGroup } from "../Avatar";
import { statusProps } from "../status/statusProps";

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
  responseComplete: boolean;
}

interface AvatarsCellProps extends TableCellHideableProps {
  avatars: (EntitySummaryPartsFragment | UserSummaryPartsFragment)[] | null | undefined;
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
          variant="description"
          color="primary"
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
        {avatars ? <AvatarGroup avatars={avatars} /> : null}
      </Box>
    </TableCellHideable>
  );
};

export const StatusCell = ({
  expirationDate,
  alreadyResponded,
  responseComplete,
  ...props
}: StatusCellProps): JSX.Element => {
  const now = new Date();
  const timeLeft = expirationDate.getTime() - now.getTime();
  const timeLeftStr = intervalToIntuitiveTimeString(Math.max(timeLeft, 0));

  // TODO: this sbhould actually be the lesser of the expirationDate and when the decision was made
  if (responseComplete) {
    return (
      <TwoTierCell
        topText="Closed"
        align="center"
        bottomText={expirationDate.toLocaleDateString()}
        topStyleOverrides={{
          color: statusProps[Status.NotAttempted].backgroundColor,
          fontWeight: "bold",
        }}
        {...props}
      />
    );
  } else {
    return (
      <TwoTierCell
        topText="Open"
        align="center"
        bottomText={timeLeftStr}
        topStyleOverrides={{
          color: statusProps[Status.InProgress].backgroundColor,
          fontWeight: "bold",
        }}
        bottomStyleOverrides={{
          color: alreadyResponded || timeLeft > 1000 * 60 * 60 * 24 ? "" : "red",
        }}
        {...props}
      />
    );
  }
};

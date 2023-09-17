import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { SxProps, TableCellProps, styled } from "@mui/material";
import { AvatarGroup, UserDataProps } from "../shared/Avatar";
import TableCell from "@mui/material/TableCell";

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
}

interface AvatarsCellProps extends TableCellHideableProps {
  avatars: UserDataProps[];
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
  ...props
}: AvatarsCellProps): JSX.Element => {
  return (
    <TableCellHideable {...props}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <AvatarGroup users={avatars} />
      </Box>
    </TableCellHideable>
  );
};

export const StatusCell = ({
  expirationDate,
  alreadyResponded,
  ...props
}: StatusCellProps): JSX.Element => {
  const now = new Date();
  const remainingMinutes =
    (expirationDate.getTime() - now.getTime()) / (1000 * 60);

  // TODO: this sbhould actually be the lesser of the expirationDate and when the decision was made
  if (remainingMinutes < 0) {
    return (
      <TwoTierCell
        topText="Closed"
        bottomText={expirationDate.toLocaleString("en-US", {
          day: "numeric",
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
        bottomStyleOverrides={{ color: alreadyResponded ? "" : "red" }}
        {...props}
      />
    );
  else if (remainingMinutes < 60 * 24)
    return (
      <TwoTierCell
        topText="Open"
        bottomText={`${Math.round(remainingMinutes / 60)} hour${
          Math.round(remainingMinutes / 60) > 1 ? "s" : ""
        } left`}
        bottomStyleOverrides={{ color: alreadyResponded ? "" : "red" }}
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

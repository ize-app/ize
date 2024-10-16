import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { Typography, TypographyProps } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ReactElement } from "react";
import { Link, generatePath } from "react-router-dom";

import { FieldDataType } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

dayjs.extend(utc);

export const renderFreeInputValue = (
  value: string,
  type: FieldDataType,
  fontSize = "1rem",
): ReactElement => {
  const defaultProps: TypographyProps = {
    fontSize,
    color: "primary",
    sx: { whiteSpace: "pre-line" },
  };
  switch (type) {
    case FieldDataType.String:
      return <Typography {...defaultProps}>{value}</Typography>;
    case FieldDataType.Number:
      return <Typography {...defaultProps}>{value}</Typography>;
    case FieldDataType.Date:
      return (
        <>
          <InsertInvitationOutlinedIcon fontSize="small" color="primary" />
          <Typography {...defaultProps}>{dayjs.utc(value).format("MMMM D YYYY")}</Typography>
        </>
      );
    case FieldDataType.DateTime:
      return (
        <>
          <AccessTimeOutlinedIcon fontSize="small" color="primary" />
          <Typography {...defaultProps}>
            {dayjs.utc(value).format("MMMM D YYYY, H:mm a").toString()}
          </Typography>
        </>
      );
    case FieldDataType.Uri:
      return (
        <>
          <LinkOutlinedIcon fontSize="small" color="primary" />
          <Typography
            component={"a"}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            {...defaultProps}
          >
            {value}
          </Typography>
        </>
      );
    // this case statement shouldn't be hit because it's handled upstream
    // TODO: make this not as janky
    case FieldDataType.EntityIds:
      return <div></div>;
    case FieldDataType.FlowIds:
      return <div></div>;
    case FieldDataType.Webhook:
      return <div></div>;
    case FieldDataType.FlowVersionId:
      return (
        <>
          <LinkOutlinedIcon fontSize="small" color="primary" />
          {/* <Typography
            marginLeft={"8px"}
            fontSize={fontSize}
            component={"a"}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
          >
            Flow
          </Typography> */}
          <Link
            to={generatePath(Route.FlowVersion, {
              flowVersionId: fullUUIDToShort(value),
            })}
          >
            Flow
          </Link>
        </>
      );
  }
};

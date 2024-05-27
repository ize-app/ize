import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { Typography } from "@mui/material";
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
  fontSize = ".875rem",
): ReactElement => {
  switch (type) {
    case FieldDataType.String:
      return <Typography fontSize={fontSize}>{value}</Typography>;
    case FieldDataType.Number:
      return <Typography>{value}</Typography>;
    case FieldDataType.Date:
      return (
        <>
          <InsertInvitationOutlinedIcon fontSize="small" color="primary" />
          <Typography fontSize={fontSize}>{dayjs.utc(value).format("MMMM D YYYY")}</Typography>
        </>
      );
    case FieldDataType.DateTime:
      return (
        <>
          <AccessTimeOutlinedIcon fontSize="small" color="primary" />
          <Typography fontSize={fontSize}>
            {dayjs.utc(value).format("MMMM D YYYY, H:mm a").toString()}
          </Typography>
        </>
      );
    case FieldDataType.Uri:
      return (
        <>
          <LinkOutlinedIcon fontSize="small" color="primary" />
          <Typography
            marginLeft={"8px"}
            fontSize={fontSize}
            component={"a"}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </Typography>
        </>
      );
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

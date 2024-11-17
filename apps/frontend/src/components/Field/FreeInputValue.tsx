import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { Typography, TypographyProps } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Link, generatePath } from "react-router-dom";

import { FieldDataType } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { stringifyFreeInputValue } from "./stringifyFreeInputValue";

dayjs.extend(utc);

export const FreeInputValue = ({
  value,
  type,
  fontSize = "1rem",
}: {
  value: string;
  type: FieldDataType;
  fontSize?: string;
}) => {
  const stringVal = stringifyFreeInputValue({ value, dataType: type });
  const defaultProps: TypographyProps = {
    fontSize,
    color: "primary",
    sx: { whiteSpace: "pre-line" },
  };
  switch (type) {
    case FieldDataType.String:
      return <Typography {...defaultProps}>{stringVal}</Typography>;
    case FieldDataType.Number:
      return <Typography {...defaultProps}>{stringVal}</Typography>;
    case FieldDataType.Date:
      return (
        <>
          <InsertInvitationOutlinedIcon fontSize="small" color="primary" />
          <Typography {...defaultProps}>{stringVal}</Typography>
        </>
      );
    case FieldDataType.DateTime:
      return (
        <>
          <AccessTimeOutlinedIcon fontSize="small" color="primary" />
          <Typography {...defaultProps}>{stringVal}</Typography>
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
            {stringVal}
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

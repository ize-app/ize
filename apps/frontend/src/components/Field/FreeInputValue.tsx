import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { Box, Typography, TypographyProps } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Link, generatePath } from "react-router-dom";

import { FieldDataType } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

import { stringifyFreeInputValue } from "../Form/InputField/stringifyFreeInputValue";

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
    sx: { whiteSpace: "pre-line" },
  };
  switch (type) {
    case FieldDataType.String:
      return <Typography {...defaultProps}>{stringVal}</Typography>;
    case FieldDataType.Number:
      return <Typography {...defaultProps}>{stringVal}</Typography>;
    case FieldDataType.Date:
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <InsertInvitationOutlinedIcon fontSize="small" color="primary" />
          <Typography {...defaultProps}>{stringVal}</Typography>
        </Box>
      );
    case FieldDataType.DateTime:
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <AccessTimeOutlinedIcon fontSize="small" color="primary" />
          <Typography {...defaultProps}>{stringVal}</Typography>
        </Box>
      );
    case FieldDataType.Uri:
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
        </Box>
      );
    // this case statement shouldn't be hit because it's handled upstream
    // TODO: make this not as janky
    case FieldDataType.EntityIds:
      return <div></div>;
    case FieldDataType.FlowIds:
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

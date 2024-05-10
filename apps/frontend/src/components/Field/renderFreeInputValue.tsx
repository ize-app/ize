import { FieldDataType } from "@/graphql/generated/graphql";
import { Typography } from "@mui/material";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ReactElement } from "react";
dayjs.extend(utc);

export const renderFreeInputValue = (value: string, type: FieldDataType): ReactElement => {
  switch (type) {
    case FieldDataType.String:
      return <Typography fontSize={".875rem"}>{value}</Typography>;
    case FieldDataType.Number:
      return <Typography>{value}</Typography>;
    case FieldDataType.Date:
      return (
        <>
          <InsertInvitationOutlinedIcon fontSize="small" color="primary" />
          <Typography fontSize={".875rem"}>{dayjs.utc(value).format("MMMM D YYYY")}</Typography>
        </>
      );
    case FieldDataType.DateTime:
      return (
        <>
          <AccessTimeOutlinedIcon fontSize="small" color="primary" />
          <Typography fontSize={".875rem"}>
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
            fontSize={".875rem"}
            component={"a"}
            href={value}
            target="_blank"
            rel="noopener noreferrer"
          >
            {value}
          </Typography>
        </>
      );
  }
};

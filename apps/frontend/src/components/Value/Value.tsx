import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { Box, Typography, TypographyProps } from "@mui/material";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Link, generatePath } from "react-router-dom";

import { FieldFragment, ValueFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";
import { userTimezone } from "@/utils/timezone";

import { EntityList } from "./EntityList";
import { FlowsList } from "./FlowsList";
import { FieldOptions } from "../Field/FieldOptions";

dayjs.extend(utc);
dayjs.extend(timezone);

interface OptionValueProps {
  type: "option";
  value: ValueFragment;
  fontSize?: string;
}

interface FieldAnswerValueProps {
  type: "fieldAnswer";
  field: FieldFragment;
  value: ValueFragment;
  fontSize?: string;
}

type ValueProps = OptionValueProps | FieldAnswerValueProps;

export const Value = ({ value, fontSize = "1rem", ...args }: ValueProps) => {
  const defaultProps: TypographyProps = {
    fontSize,
    sx: { whiteSpace: "pre-line" },
  };
  switch (value.__typename) {
    case "StringValue":
      return <Typography {...defaultProps}>{value.value}</Typography>;
    case "FloatValue":
      return <Typography {...defaultProps}>{value.float}</Typography>;
    case "DateValue":
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <InsertInvitationOutlinedIcon fontSize="small" color="primary" />
          <Typography {...defaultProps}>{dayjs(value.date).format("MMMM D YYYY")}</Typography>
        </Box>
      );
    case "DateTimeValue":
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <AccessTimeOutlinedIcon fontSize="small" color="primary" />
          <Typography {...defaultProps}>
            {dayjs
              .utc(value.dateTime)
              .tz(dayjs.tz.guess())
              .format("MMMM D YYYY, HH:mm a")
              .toString()}{" "}
            ({userTimezone})
          </Typography>
        </Box>
      );
    case "UriValue":
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
            {value.uri}
          </Typography>
        </Box>
      );
    // this case statement shouldn't be hit because it's handled upstream
    // TODO: make this not as janky
    case "EntitiesValue":
      return <EntityList entities={value.entities} />;
    case "FlowsValue":
      return <FlowsList flows={value.flows} />;
    case "FlowVersionValue":
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <LinkOutlinedIcon fontSize="small" color="primary" />
          <Link
            to={generatePath(Route.FlowVersion, {
              flowVersionId: fullUUIDToShort(value.flowVersion.flowVersionId),
            })}
          >
            {value.flowVersion.flowName}
          </Link>
        </Box>
      );
    case "OptionSelectionsValue":
      if (args.type === "fieldAnswer") {
        return (
          // <LabeledGroupedInputs sx={{ backgroundColor: "white" }}>
          <FieldOptions
            field={args.field}
            optionSelections={value.selections}
            finalOptions={true}
            onlyShowSelections={true}
          />
          // </LabeledGroupedInputs>
        );
      } else throw Error("An option cannot have an OptionSelectionsValue");
  }
};

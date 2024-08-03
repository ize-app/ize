import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Link, generatePath } from "react-router-dom";

import { FlowSummaryFragment } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

export const FlowsList = ({ flows }: { flows: FlowSummaryFragment[] }) => (
  <Box
    component="ul"
    sx={{ display: "flex", marginBlockStart: "0rem", paddingInlineStart: "16px" }}
  >
    {flows.map((flow) => (
      <Typography component="li" fontSize={".875rem"} key={flow.flowId}>
        <Link
          key={flow.flowId}
          to={generatePath(Route.Flow, {
            flowId: fullUUIDToShort(flow.flowId),
            flowVersionId: null,
          })}
        >
          {flow.name + (flow.group ? ` (${flow.group.name})` : "")}
        </Link>
      </Typography>
    ))}
  </Box>
);

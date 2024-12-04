import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Link, generatePath } from "react-router-dom";

import { FlowReference } from "@/graphql/generated/graphql";
import { Route } from "@/routers/routes";
import { fullUUIDToShort } from "@/utils/inputs";

export const FlowsList = ({ flows }: { flows: FlowReference[] }) => (
  <Box
    component="ul"
    sx={{
      display: "flex",
      flexDirection: "column",
      marginBlockStart: "0rem",
      marginBlockEnd: "0rem",
      paddingInlineStart: "16px",
    }}
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
          {flow.flowName}
        </Link>
      </Typography>
    ))}
  </Box>
);

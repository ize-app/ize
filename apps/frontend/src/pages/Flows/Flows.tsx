import Typography from "@mui/material/Typography";
import { generatePath, useNavigate } from "react-router-dom";

import Head from "@/layout/Head.tsx";
import PageContainer from "@/layout/PageContainer";
import { Route } from "@/routers/routes.ts";
import { fullUUIDToShort } from "@/utils/inputs.ts";

import { FlowsSearch } from "./FlowsSearch.tsx";

export const Flows = () => {
  const navigate = useNavigate();
  
  return (
    <PageContainer>
      <Head title={"Flows"} description={"View and trigger your collaborative flows."} />
      <Typography variant="h1">Flows</Typography>
      <FlowsSearch
        onClickRow={(flow) => {
          navigate(
            generatePath(Route.Flow, {
              flowId: fullUUIDToShort(flow.flowId),
              flowVersionId: null,
            }),
          );
        }}
      />
    </PageContainer>
  );
};

import Typography from "@mui/material/Typography";

import Head from "@/layout/Head.tsx";
import PageContainer from "@/layout/PageContainer";

import { FlowsSearch } from "./FlowsSearch.tsx";

export const Flows = () => {
  return (
    <PageContainer>
      <Head title={"Flows"} description={"View and trigger your collaborative flows."} />
      <Typography variant="h1">Flows</Typography>
      <FlowsSearch />
    </PageContainer>
  );
};

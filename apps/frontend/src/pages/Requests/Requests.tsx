import Typography from "@mui/material/Typography";

import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";

import { RequestSearch } from "./RequestStepsSearch";

export const Requests = () => {
  return (
    <PageContainer>
      <Head
        title={"Requests"}
        description={"View and trigger requests for your collaborative workflows."}
      />
      <Typography variant="h1">Requests</Typography>
      <RequestSearch userOnly />
    </PageContainer>
  );
};

import Typography from "@mui/material/Typography";
import PageContainer from "@/layout/PageContainer";
import { RequestStepsSearch } from "./RequestStepsSearch";

export const Requests = () => {
  return (
    <PageContainer>
      <Typography variant="h1">Requests</Typography>
      <RequestStepsSearch userOnly  />
    </PageContainer>
  );
};

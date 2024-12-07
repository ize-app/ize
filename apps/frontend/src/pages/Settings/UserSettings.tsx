import Typography from "@mui/material/Typography";

import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";

import { ProfileForm } from "./ProfileForm";
import { UserIdentities } from "./UserIdentities";

export const UserSettings = () => {
  return (
    <>
      <Head title={"Settings"} description={"Ize Settings"} />
      <PageContainer>
        <Typography variant="h1">Settings</Typography>
        <Typography variant="h2">Profile</Typography>
        <ProfileForm />
        <Typography variant="h2">Connected accounts</Typography>
        <UserIdentities />
      </PageContainer>
    </>
  );
};

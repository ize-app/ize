import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import TaskAltOutlined from "@mui/icons-material/TaskAltOutlined";

import * as React from "react";

import { useSetupServerGroupWizardState } from "./setup_server_wizard";

interface ExplainerProps {
  icon: JSX.Element;
  iconSide: "left" | "right";
  children: React.ReactNode;
}

const ExplainerBox = ({ icon, iconSide, children }: ExplainerProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: iconSide === "left" ? "row" : "row-reverse",
        justifyContent: "flex-start",
        width: "100%",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Typography variant="body1" sx={{ width: "100%" }}>
        {children}
      </Typography>
    </Box>
  );
};

export const HowCultsWorks = () => {
  const { formState } = useSetupServerGroupWizardState();

  const serverName = formState.serverName ?? "your server";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "40px",
      }}
    >
      <ExplainerBox
        icon={<GroupsOutlined color="primary" sx={{ fontSize: "60px" }} />}
        iconSide="left"
      >
        We're going to create a Cults{" "}
        <span style={{ fontWeight: "bold" }}>group</span> for {serverName}.
        You'll also be able to create Cults groups for any of {serverName}'s
        roles.
      </ExplainerBox>

      <ExplainerBox
        icon={<AccountTreeOutlined color="primary" sx={{ fontSize: "60px" }} />}
        iconSide="left"
      >
        Groups create <span style={{ fontWeight: "bold" }}>processes</span>{" "}
        together that define how certain kinds of decisions are made- e.g.
        adding an event to a shared calendar, giving someone a Discord role,
        approving an expense, etc.
      </ExplainerBox>
      <ExplainerBox
        icon={<TaskAltOutlined color="primary" sx={{ fontSize: "60px" }} />}
        iconSide="left"
      >
        Processes are used to create{" "}
        <span style={{ fontWeight: "bold" }}>requests</span>. For example, you
        could use the “Give user @core-team Discord role” process to propose
        giving example-user#1234 the @core-team role.
      </ExplainerBox>
    </Box>
  );
};

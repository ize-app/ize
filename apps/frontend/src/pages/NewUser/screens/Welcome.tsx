import { Box, Typography } from "@mui/material";

import flowExampleUrl from "@/assets/flow-example.png";
import { WizardBody, WizardNav } from "@/components/Wizard";

import { useNewUserWizardState } from "../newUserWizardSetup";

export const Welcome = () => {
  const { onNext, onPrev, nextLabel, disableNext } = useNewUserWizardState();

  return (
    <form>
      <WizardBody>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "900px" }}>
          <Typography>
            <strong>Welcome to Ize 👀</strong>
            <br />
            <br />
            Ize allows teams to build collective process{" "}
            <span style={{ fontStyle: "italic" }}>flows</span> that span across tools, teams, and
            digital identities.
            <br />
            <br />
            <span style={{ textDecoration: "underline" }}>Everything</span> in Ize happens through
            collaborative flows - even the process to evolve a flow is, itself, a flow. There is no
            concept of an admin in Ize. It&apos;s flows all the way down 🐢.
            <br />
            <br />
            <strong>The anatomy of a flow:</strong>
            {/* <span style={{ fontWeight: "bold" }}>{formState.name}</span> */}
          </Typography>
          <Box
            sx={(theme) => ({
              display: "flex",
              width: "100%",
              alignItems: "center",
              gap: "30px",
              outline: "1px solid rgba(0, 0, 0, 0.23)",
              [theme.breakpoints.down("md")]: {
                flexDirection: "column",
                gap: "0px",
              },
              marginBottom: "36px",
            })}
          >
            <Box component="img" src={flowExampleUrl} sx={{ width: "340px", height: "auto" }} />
            <Box
              component="ol"
              sx={(theme) => ({
                padding: "30px 30px",
                display: "flex",

                [theme.breakpoints.down("md")]: {
                  flexDirection: "column",
                  gap: "8px",
                  padding: "0px 30px",
                },
                height: "100%",
                flexDirection: "column",
                justifyContent: "space-between",
              })}
            >
              <Typography component="li">
                <span style={{ fontWeight: 600 }}>Trigger</span>: Someone triggers a collaborative{" "}
                <span style={{ fontStyle: "italic" }}>flow</span>. Flows can be reused for recurring
                collective tasks.
              </Typography>
              <Typography component="li">
                <span style={{ fontWeight: 600 }}>Collaborative step</span>: People respond and a
                result is created (a decision, AI summary, ranked list, etc).
              </Typography>
              <Typography component="li">
                <span style={{ fontWeight: 600 }}>Action</span>: An action is automatically
                triggered (triggering another tool, starting a new collaborative step, evolving the
                flow).
              </Typography>
            </Box>
          </Box>
        </Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} disableNext={disableNext} />
    </form>
  );
};

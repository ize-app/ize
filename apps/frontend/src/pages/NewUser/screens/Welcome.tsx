import { Box, Typography, useTheme } from "@mui/material";

import flowExampleUrl from "@/assets/flow-example.png";
import { WizardBody, WizardNav } from "@/components/Wizard";

import { useNewUserWizardState } from "../newUserWizardSetup";

export const Welcome = () => {
  const { onNext, onPrev, nextLabel, disableNext } = useNewUserWizardState();
  const theme = useTheme();

  return (
    <form>
      <WizardBody>
        <Box sx={{ display: "flex", flexDirection: "column", maxWidth: "900px" }}>
          <Typography>
            <br />
            <br />
            Ize allows teams to build collective process{" "}
            <span style={{ fontStyle: "italic" }}>flows</span> that span across tools, teams, and
            digital identities. Flows define and automate how a groups collect their voices and take
            action.
            <br />
            <br />
            <span style={{ textDecoration: "underline" }}>Everything</span> in Ize happens through
            collaborative flows - even the process to evolve a flow is, itself, a flow. There is no
            concept of an admin in Ize. It&apos;s flows all the way down 🐢.
            <br />
            <br />
            {/* <span style={{ fontWeight: "bold" }}>{formState.name}</span> */}
          </Typography>
          <Typography color="primary" variant={"h3"} fontWeight={600}>
            The anatomy of a flow
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
              marginBottom: "30px",
              marginTop: "30px",
            })}
          >
            <Box
              component="img"
              src={flowExampleUrl}
              sx={{ width: "340px", height: "auto" }}
              alt="Image showing an example flow diagram in Ize. It begins with a trigger, then has a 'Summarize options w/ AI' step, and finally it calls the 'Add to Airtable priority tracker' action"
            />
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
                <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>Trigger</span>:
                Someone triggers a collaborative <span style={{ fontStyle: "italic" }}>flow</span>.
                Flows can be reused for recurring collective tasks.
              </Typography>
              <Typography component="li">
                <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  Collaborative step
                </span>
                : People respond and a result is created (a decision, AI summary, ranked list, etc).
              </Typography>
              <Typography component="li">
                <span style={{ fontWeight: 600, color: theme.palette.primary.main }}>Action</span>:
                An action is automatically triggered (e.g. paying out a grant, scheduling an event on a group calendar, starting a new
                collaborative step, etc).
              </Typography>
            </Box>
          </Box>
        </Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} disableNext={disableNext} />
    </form>
  );
};

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";

interface WizardContainerProps {
  progressBarSteps: string[];
  progressBarStep: number;
  children: React.ReactNode;
}

export const WizardContainer = ({
  progressBarSteps,
  progressBarStep,
  children,
}: WizardContainerProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        marginTop: "16px",
        alignItems: "center",
      }}
    >
      <Stepper activeStep={progressBarStep} sx={{ width: "100%" }}>
        {progressBarSteps.map((title) => (
          <Step key={title}>
            <StepLabel>{title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          width: "100%",
          marginTop: "36px",
          [theme.breakpoints.up("sm")]: {
            paddingLeft: "48px",
            paddingRight: "48px",
          },
          maxWidth: "1000px",
        })}
      >
        {children}
      </Box>
    </Box>
  );
};

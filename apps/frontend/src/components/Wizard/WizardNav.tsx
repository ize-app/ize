import { AppBar } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

interface WizardNavProps {
  onPrev: () => void;
  onNext: () => void;
  nextLabel: string;
  disableNext?: boolean;
}

export const WizardNav = ({ onPrev, onNext, nextLabel, disableNext }: WizardNavProps) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        border: "none",
        // zIndex: (theme) => theme.zIndex.drawer + 1,
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        top: "auto",
        bottom: 0,
      }}
    >
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        height="48px"
        gap="36px"
        padding="0px 16px"
      >
        {onPrev ? (
          <div>
            <Button variant="text" onClick={onPrev}>
              Previous
            </Button>
          </div>
        ) : (
          /** To keep next on the right when there is no prev we render an empty div */ <div />
        )}
        {onNext && (
          <div>
            <Button disabled={disableNext} variant="contained" onClick={onNext} size="small">
              {nextLabel}
            </Button>
          </div>
        )}
      </Stack>
    </AppBar>
  );
};

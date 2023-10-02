import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

interface WizardNavProps {
  onPrev: () => void;
  onNext: () => void;
  nextLabel: string;
  disableNext?: boolean;
}

export const WizardNav = ({
  onPrev,
  onNext,
  nextLabel,
  disableNext,
}: WizardNavProps) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    marginTop="16px"
    height="80px"
  >
    {onPrev ? (
      <div>
        <Button variant="outlined" onClick={onPrev}>
          Previous
        </Button>
      </div>
    ) : (
      /** To keep next on the right when there is no prev we render an empty div */ <div />
    )}
    {onNext && (
      <div>
        <Button disabled={disableNext} variant="contained" onClick={onNext}>
          {nextLabel}
        </Button>
      </div>
    )}
  </Stack>
);

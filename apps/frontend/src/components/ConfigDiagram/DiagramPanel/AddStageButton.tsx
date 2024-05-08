import { Button } from "@mui/material";

export const AddStageButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Button
    variant="outlined"
    size="medium"
    color="secondary"
    sx={{
      width: "240px",
      border: "2px dashed",
      "&&:hover": {
        border: "2px dashed",
      },
    }}
    onClick={onClick}
  >
    {label}
  </Button>
);

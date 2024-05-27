import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import * as React from "react";

export default function StatusToggle({
  status,
  setStatus,
}: {
  status: "open" | "closed";
  setStatus: React.Dispatch<React.SetStateAction<"open" | "closed">>;
}) {
  const handleToggle = (_event: React.MouseEvent<HTMLElement>, newStatus: "open" | "closed") => {
    // Enforcing one button to be active
    if (newStatus !== null) {
      setStatus(newStatus);
    }
  };

  return (
    <ToggleButtonGroup
      value={status}
      exclusive
      color="primary"
      onChange={handleToggle}
      aria-label="text alignment"
      size="small"
    >
      <ToggleButton value="open" aria-label="left aligned">
        Open
      </ToggleButton>
      <ToggleButton value="closed" aria-label="centered">
        Closed
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

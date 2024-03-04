import Box from "@mui/material/Box";
import { ReactNode } from "react";

export const LabeledGroupedInputs = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        border: "solid 1px",
        borderColor: "rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
        position: "relative",
        // overflowX: "hidden",
      }}
    >
      <fieldset
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
          top: "-12px",
          border: "none",
        }}
      >
        <legend>
          <span
            style={{
              backgroundColor: "white",
              fontWeight: "400",
              fontFamily: "roboto",
              color: "rgba(0, 0, 0, 0.6)",
              fontSize: ".75rem",
            }}
          >
            {label}
          </span>
        </legend>
      </fieldset>
      {children}
    </Box>
  );
};

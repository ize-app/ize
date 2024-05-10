import { Box, Typography } from "@mui/material";
import React from "react";

interface DataTable {
  data: { label: string; value: React.ReactElement }[];
  ariaLabel: string;
}

export const DataTable = ({ data, ariaLabel }: DataTable) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%",
      }}
    >
      {data.map((d, index) => (
        <DataRow
          key={index.toString()}
          label={d.label}
          value={d.value}
          tableAriaLabel={ariaLabel}
        />
      ))}
    </Box>
  );
};

const DataRow = ({
  label,
  value,
  tableAriaLabel,
}: {
  label: string;
  value: React.ReactElement;
  tableAriaLabel: string;
}) => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between" }}
      aria-label={`${tableAriaLabel} row`}
    >
      <Typography>{label}</Typography>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyConent: "flex-start" }}>
        {value}
      </Box>
    </Box>
  );
};

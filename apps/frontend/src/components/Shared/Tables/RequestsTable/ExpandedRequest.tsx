import Launch from "@mui/icons-material/Launch";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { RequestInputTable, RequestOptions } from "../../Request";
import { RequestProps } from "../mockData";
import { Typography } from "@mui/material";
import { useState } from "react";

export const ExpandedRequest = ({ request }: { request: RequestProps }) => {
  //   const [response, setResponse] = useState(null);
  return (
    <Box
      sx={{
        display: "flex",
        padding: "20px 30px",
        flexDirection: "column",
        alignOtems: "flex-start",
        gap: "8px",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          display: "Flex",
          padding: "1px",
          alignItems: "center",
          gap: "1px",
          alignSelf: "stretch",
          border: "1px solid #E5E5E5",
          background: "#E5E5E5",
        }}
      >
        <Box
          sx={{
            display: "flex",
            padding: "16px",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            gap: "8px",
            flex: "1 0 0",
            alignSelf: "stretch",
            background: "var(--m-3-white, #FFF)",
          }}
        >
          <Typography variant="body1">{request.name}</Typography>
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Button
              variant={"outlined"}
              size="small"
              startIcon={<Launch />}
              sx={{ width: "160px" }}
            >
              Request details
            </Button>
            <Button
              variant={"outlined"}
              size="small"
              startIcon={<Launch />}
              sx={{ width: "160px" }}
            >
              Process details
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            // padding: "16px",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: "1 0 0",
            alignSelf: "stretch",
            background: "var(--m-3-white, #FFF)",
          }}
        >
          <RequestInputTable inputs={request.inputs} />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          padding: "10px 8px",
          flexDirection: "row",
          alignItems: "flex-start",
          alignSelf: "stretch",
          border: "1px solid #DFD5EC",
        }}
      >
        <RequestOptions options={request.options} />
        <Box
          sx={{
            width: "300px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button variant="contained">Submit</Button>
        </Box>
      </Box>
    </Box>
  );
};

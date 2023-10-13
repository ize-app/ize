import Launch from "@mui/icons-material/Launch";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { RequestInputTable, RequestOptions } from "../../Request";
import { RequestProps } from "../mockData";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useState } from "react";

export const ExpandedRequest = ({ request }: { request: RequestProps }) => {
  //   const [response, setResponse] = useState(null);
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        padding: "20px 30px",
        flexDirection: "column",
        alignOtems: "flex-start",
        gap: "8px",
        alignSelf: "stretch",
        [theme.breakpoints.down("md")]: {
          padding: "8px",
        },
      })}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          padding: "1px",
          alignItems: "center",
          alignSelf: "stretch",
          border: "1px solid #E5E5E5",
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
          },
        })}
      >
        <Box
          sx={(theme) => ({
            display: "flex",
            padding: "16px",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            gap: "8px",
            flex: "1 0 0",
            alignSelf: "stretch",
            background: "var(--m-3-white, #FFF)",
            [theme.breakpoints.up("sm")]: {
              borderRight: "1px solid #E5E5E5",
              borderBottom: "none",
            },
          })}
        >
          <Typography variant="body1">{request.name}</Typography>
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Button
              variant={"outlined"}
              size="small"
              startIcon={<Launch />}
              sx={{ width: "100px" }}
            >
              Request
            </Button>
            <Button
              variant={"outlined"}
              size="small"
              startIcon={<Launch />}
              sx={{ width: "100px" }}
            >
              Process
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
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
      <Paper
        elevation={2}
        sx={(theme) => ({
          display: "flex",
          padding: "16px",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
          },
        })}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <RequestOptions options={request.options} />
        </Box>

        <Box
          sx={{
            minWidth: "120px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button variant="contained">Submit</Button>
        </Box>
      </Paper>
    </Box>
  );
};

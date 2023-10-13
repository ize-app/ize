import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
// import FormHelperText from "@mui/material/FormHelperText";
// import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
// import { RadioControl } from "../Form";
// import { Control } from "react-hook-form";
import { useContext} from "react";

import { SnackbarContext } from "../../../contexts/SnackbarContext";

export const RequestOptions = ({
  options,
  onSubmit,
}: {
  options: string[];
  onSubmit: () => void;
}) => {
  const { setSnackbarOpen, setSnackbarData } = useContext(SnackbarContext);

  return (
    <>
      <Box
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
          <FormControl component="fieldset" required>
            <RadioGroup
              aria-labelledby="radio-buttons-group-options"
              name="row-radio-buttons-group-options"
              sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {options.map((option, index) => (
                <FormControlLabel
                  value={option}
                  key={"option" + index.toString()}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {/* <FormHelperText
        sx={{
          color: "error.main",
        }}
      >
        {error?.message ?? ""}
      </FormHelperText> */}
          </FormControl>
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
          <Button
            variant="contained"
            onClick={() => {
              setSnackbarData({ message: "Response submitted!" });
              setSnackbarOpen(true);
              onSubmit();
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

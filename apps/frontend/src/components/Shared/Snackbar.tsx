import { AlertProps, default as MuiAlert } from "@mui/material/Alert";
import { default as MuiSnackbar } from "@mui/material/Snackbar";
import { forwardRef, useContext } from "react";

import { SnackbarContext } from "../../contexts/SnackbarContext";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Snackbar = () => {
  const { snackbarOpen, setSnackbarOpen, snackbarData } = useContext(SnackbarContext);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <MuiSnackbar open={snackbarOpen} autoHideDuration={7000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={snackbarData.type} sx={{ width: "100%" }}>
        {snackbarData.message ?? "Success!"}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;

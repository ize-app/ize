import { AlertColor } from "@mui/material/Alert";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export interface SnackbarDataProps {
  message: string;
  type: AlertColor;
}

interface SnackbarContextValue {
  snackbarOpen: boolean;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  snackbarData: SnackbarDataProps;
  setSnackbarData: Dispatch<SetStateAction<SnackbarDataProps>>;
}

export const SnackbarContext = createContext<SnackbarContextValue>({
  snackbarOpen: false,
  setSnackbarOpen: () => {
    return;
  },
  snackbarData: { message: "Success!", type: "success" },
  setSnackbarData: () => {
    return;
  },
});

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "Success!",
    type: "success" as AlertColor,
  });

  return (
    <SnackbarContext.Provider
      value={{ snackbarOpen, setSnackbarOpen, snackbarData, setSnackbarData }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

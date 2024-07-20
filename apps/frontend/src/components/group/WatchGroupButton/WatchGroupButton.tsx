import { IconButtonOwnProps, Tooltip } from "@mui/material";
// import { useContext } from "react";

import { EyeButton } from "@/components/buttons/EyeButton";
// import { SnackbarContext } from "@/contexts/SnackbarContext";

export const WatchGroupButton = ({
  groupId,
  isWatched,
  size = "small",
}: {
  groupId: string;
  isWatched: boolean;
  size?: IconButtonOwnProps["size"];
}) => {
  console.log("group id", groupId);
  // const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);

  // const onError = () => {
  //   setSnackbarOpen(true);
  //   setSnackbarData({ message: "Cannot find this group", type: "error" });
  // };

  return (
    <Tooltip
      title={
        isWatched
          ? "Watch requests created by this group"
          : "Stop watching requests created by this group"
      }
    >
      <EyeButton active={isWatched} size={size} />
    </Tooltip>
  );
};

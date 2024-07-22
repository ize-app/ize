import { useMutation } from "@apollo/client";
import { Icon, IconButton, IconButtonOwnProps, Tooltip } from "@mui/material";
import { useContext, useState } from "react";

import eyeActiveUrl from "@/assets/ize-eye-active.svg";
import eyeInactiveUrl from "@/assets/ize-eye-inactive.svg";
import { SnackbarContext } from "@/contexts/SnackbarContext";
import { WatchGroupDocument } from "@/graphql/generated/graphql";

export const WatchGroupButton = ({
  groupId,
  watched,
  size = "small",
}: {
  groupId: string;
  watched: boolean;
  size?: IconButtonOwnProps["size"];
}) => {
  console.log("group id", groupId);
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const [isWatched, setIsWatched] = useState(watched);

  // const onError = () => {
  //   setSnackbarOpen(true);
  //   setSnackbarData({ message: "Cannot find this group", type: "error" });
  // };

  const [mutate] = useMutation(WatchGroupDocument, {
    onCompleted: (_data) => {
      setIsWatched(!isWatched);
      setSnackbarOpen(true);
      setSnackbarData({
        message: isWatched ? "Group unwatched" : "Now watching this group",
        type: "success",
      });
    },
    onError: (_error) => {
      setSnackbarOpen(true);
      setSnackbarData({
        message: isWatched
          ? "Unwatch group request was unsuccessful"
          : "Watch group request was unsuccessful",
        type: "error",
      });
    },
  });

  const onSubmit = async () => {
    await mutate({
      variables: { groupId, watch: !watched },
    });
  };

  return (
    <Tooltip
      title={
        isWatched
          ? "Stop watching requests created by this group"
          : "Watch requests created by this group"
      }
    >
      <IconButton size={size} onClick={onSubmit}>
        <Icon fontSize={size}>
          {isWatched ? <img src={eyeActiveUrl} /> : <img src={eyeInactiveUrl} />}
        </Icon>
      </IconButton>
    </Tooltip>
  );
};

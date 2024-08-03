import { useMutation } from "@apollo/client";
import { Icon, IconButton, IconButtonOwnProps, Tooltip } from "@mui/material";
import { MouseEventHandler, useContext, useState } from "react";

import eyeActiveUrl from "@/assets/ize-eye-active.svg";
import eyeInactiveUrl from "@/assets/ize-eye-inactive.svg";
import { WatchGroupDocument } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";

export const WatchGroupButton = ({
  groupId,
  watched,
  size = "small",
}: {
  groupId: string;
  watched: boolean;
  size?: IconButtonOwnProps["size"];
}) => {
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const [isWatched, setIsWatched] = useState(watched);
  const { me } = useContext(CurrentUserContext);
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

  const onSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    await mutate({
      variables: { groupId, watch: !watched },
    });
  };

  if (!me) return null;

  return (
    <Tooltip title={isWatched ? "Stop watching this group" : "Watch this group"}>
      <IconButton size={size} onClick={onSubmit}>
        <Icon fontSize={size}>
          {isWatched ? <img src={eyeActiveUrl} /> : <img src={eyeInactiveUrl} />}
        </Icon>
      </IconButton>
    </Tooltip>
  );
};

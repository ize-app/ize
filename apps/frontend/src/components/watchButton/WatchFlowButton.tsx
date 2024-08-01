import { useMutation } from "@apollo/client";
import { Icon, IconButton, IconButtonOwnProps, Tooltip } from "@mui/material";
import { MouseEventHandler, useContext, useState } from "react";

import eyeActiveUrl from "@/assets/ize-eye-active.svg";
import eyeInactiveUrl from "@/assets/ize-eye-inactive.svg";
import { WatchFlowDocument } from "@/graphql/generated/graphql";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";

export const WatchFlowButton = ({
  flowId,
  watched,
  size = "small",
}: {
  flowId: string;
  watched: boolean;
  size?: IconButtonOwnProps["size"];
}) => {
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const [isWatched, setIsWatched] = useState(watched);

  // const onError = () => {
  //   setSnackbarOpen(true);
  //   setSnackbarData({ message: "Cannot find this group", type: "error" });
  // };

  const [mutate] = useMutation(WatchFlowDocument, {
    onCompleted: (_data) => {
      setIsWatched(!isWatched);
      setSnackbarOpen(true);
      setSnackbarData({
        message: isWatched ? "Flow unwatched" : "Now watching this flow",
        type: "success",
      });
    },
    onError: (_error) => {
      setSnackbarOpen(true);
      setSnackbarData({
        message: isWatched
          ? "Unwatch flow request was unsuccessful"
          : "Watch flow request was unsuccessful",
        type: "error",
      });
    },
  });

  const onSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    await mutate({
      variables: { flowId, watch: !watched },
    });
  };

  return (
    <Tooltip title={isWatched ? "Stop watching this flow" : "Watch this flow"}>
      <IconButton size={size} onClick={onSubmit}>
        <Icon fontSize={size}>
          {isWatched ? <img src={eyeActiveUrl} /> : <img src={eyeInactiveUrl} />}
        </Icon>
      </IconButton>
    </Tooltip>
  );
};

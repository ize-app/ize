import { Icon, IconButton, IconButtonOwnProps } from "@mui/material";

import eyeActiveUrl from "@/assets/ize-eye-active.svg";
import eyeInactiveUrl from "@/assets/ize-eye-inactive.svg";

export const EyeButton = ({
  active,
  size = "small",
}: {
  active: boolean;
  size?: IconButtonOwnProps["size"];
}) => {
  return (
    <IconButton size={size}>
      <Icon fontSize={size}>
        {active ? <img src={eyeActiveUrl} /> : <img src={eyeInactiveUrl} />}
      </Icon>
    </IconButton>
  );
};

import { useContext } from "react";

import { InfoBannerContainer } from "@/components/InfoBanner/InfoBannerContainer";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { Route } from "@/routers/routes";

export const GroupInvitesInfo = () => {
  const { me } = useContext(CurrentUserContext);

  if (!me || !me.hasGroupInvites) return null;
  return (
    <InfoBannerContainer
      title="You have pending group invites"
      showInfoIcon={true}
      route={Route.Groups}
    />
  );
};
